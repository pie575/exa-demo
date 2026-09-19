#!/usr/bin/env python3
"""Import Exa's published MDX without flattening its custom components."""
import concurrent.futures
import argparse
from html.parser import HTMLParser
import hashlib
import json
import pathlib
import re
import subprocess
import time

ROOT = pathlib.Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source-snapshot"
SOURCE.mkdir(exist_ok=True)
RAW = SOURCE / "markdown"
RAW.mkdir(exist_ok=True)
NAV = json.loads((SOURCE / 'navigation-metadata.json').read_text())
FULL = (SOURCE / 'llms-full.txt').read_text()
metadata = {}
REFRESH = False

class HtmlToJsx(HTMLParser):
    """Preserve production-only HTML fragments omitted by the Markdown export."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []

    def handle_starttag(self, tag, attrs):
        names = {'class': 'className', 'for': 'htmlFor', 'colspan': 'colSpan', 'rowspan': 'rowSpan', 'tabindex': 'tabIndex', 'checked': 'defaultChecked'}
        props = []
        for name, value in attrs:
            prop = names.get(name, name)
            props.append(prop + ('={true}' if name == 'checked' else '={' + json.dumps(value or '', ensure_ascii=False) + '}'))
        void = tag in {'input', 'img', 'br', 'hr', 'meta', 'link', 'source'}
        self.parts.append('<' + tag + (' ' + ' '.join(props) if props else '') + (' />' if void else '>'))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        self.parts.append('</' + tag + '>')

    def handle_data(self, data):
        self.parts.append('{' + json.dumps(data, ensure_ascii=False) + '}')

def collect(value):
    if isinstance(value, dict):
        if 'href' in value and not value['href'].startswith('http'):
            metadata[value['href'].strip('/') or 'index'] = value
        for child in value.values():
            collect(child)
    elif isinstance(value, list):
        for child in value:
            collect(child)

collect(NAV)
metadata.update(json.loads((SOURCE / 'page-metadata.json').read_text()))
sections = list(re.finditer(r'^# (.+)\nSource: (https://exa.ai/docs[^\n]*)\n', FULL, re.M))
pages = {}
for i, match in enumerate(sections):
    slug = match.group(2).removeprefix('https://exa.ai/docs').strip('/') or 'index'
    pages[slug] = {'title': match.group(1), 'url': match.group(2)}
for slug, data in metadata.items():
    pages.setdefault(slug, {'title': data.get('title', slug), 'url': 'https://exa.ai/docs/' + slug})

def fetch(url, path):
    if not REFRESH and path.exists() and path.stat().st_size > 10:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(['curl', '-fsSL', '--retry', '3', '--max-time', '90', url, '-o', str(path)], check=True, capture_output=True)

def page(slug):
    data = pages[slug]
    raw = RAW / (slug + '.md')
    fetch('https://exa.ai/docs/' + slug + '.md', raw)
    text = raw.read_text()
    downloadable = ROOT / 'docs' / 'markdown' / (slug + '.txt')
    downloadable.parent.mkdir(parents=True, exist_ok=True)
    downloadable.write_text(text)
    text = re.sub(r'^> ## Documentation Index\n(?:>.*\n)+\n', '', text)
    text = re.sub(r'^# [^\n]+\n\n', '', text, count=1)
    description = ''
    source_description = metadata.get(slug, {}).get('description', '').replace('\\n', '\n').strip()
    if metadata.get(slug, {}).get('openapi') and source_description and text.startswith('> ' + source_description):
        # Hosted Markdown quotes only the first line of a multi-paragraph API
        # description. The complete description already renders from metadata.
        description = source_description
        text = text[len(source_description) + 2:].lstrip('\n')
    elif text.startswith('> '):
        end = text.find('\n\n')
        description = text[2:end]
        text = text[end+2:]
    front = dict(metadata.get(slug, {}))
    front.pop('href', None)
    front.setdefault('title', data['title'])
    if description:
        front.setdefault('description', description)
    if front.get('description'):
        front['description'] = re.sub(r'(\]\()https://exa\.ai/docs(?=[/#)])', r'\1/docs', front['description'])
    if front.get('openapi'):
        front['openapi'] = 'docs/' + front['openapi']
        text = re.sub(r'(?:^|\n+)## OpenAPI\n[\s\S]*$', '\n', text)
    mapping_file = SOURCE / 'asset-replacements.json'
    if mapping_file.exists():
        for remote, local in json.loads(mapping_file.read_text()).items():
            text = text.replace(remote, local)
            front = {key: value.replace(remote, local) if isinstance(value, str) else value for key, value in front.items()}
    text = text.replace('const base = docsBase();', 'const base = "";')
    text = re.sub(r'((?:image|href):\s*")/(?!docs/)([^"\n]+)(")', r'\1/docs/\2\3', text)
    text = re.sub(r'(href=["\']|\]\()https://exa\.ai/docs(?=[/#"\')])', r'\1/docs', text)
    text = text.replace('](/integrations/openai-sdk#answer)', '](/docs/integrations/openai-sdk#answer)')
    if slug == 'websets/quickstart':
        # The retired production route redirects (308) to this quickstart.
        text = text.replace('](./api/how-it-works)', '](/docs/websets/quickstart)')
    if slug == 'agent/examples':
        fragment = SOURCE / 'fragments' / 'agent-examples-preview.html'
        if fragment.exists():
            renderer = HtmlToJsx()
            renderer.feed(fragment.read_text())
            text = text.replace('<h2 id="find-all-code">', ''.join(renderer.parts) + '\n\n<h2 id="find-all-code">', 1)
    out = ROOT / ('docs.mdx' if slug == 'index' else 'docs/' + slug + '.mdx')
    out.parent.mkdir(parents=True, exist_ok=True)
    # JSON strings/arrays/objects are valid YAML, preserving source frontmatter types.
    header = '\n'.join(key + ': ' + json.dumps(value, ensure_ascii=False) for key, value in front.items())
    out.write_text('---\n' + header + '\n---\n\n' + text)
    return {'path': str(out.relative_to(ROOT)), 'source': 'https://exa.ai/docs' if slug == 'index' else data['url'], 'markdown': str(raw.relative_to(ROOT)), 'sha256': hashlib.sha256(raw.read_bytes()).hexdigest(), 'bytes': raw.stat().st_size}

def main():
    manifest = []
    errors = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        futures = {pool.submit(page, slug): slug for slug in pages}
        for future in concurrent.futures.as_completed(futures):
            slug = futures[future]
            try:
                manifest.append(future.result())
            except Exception as error:
                errors.append({'page': slug, 'error': str(error)})
                print('ERROR', slug, error, flush=True)
            if (len(manifest) + len(errors)) % 20 == 0:
                print('Imported', len(manifest), '/', len(pages), flush=True)
    (SOURCE / 'manifest.json').write_text(json.dumps({'pages': sorted(manifest, key=lambda p: p['path']), 'errors': errors}, indent=2) + '\n')
    (SOURCE / 'llms-full.txt').write_text(FULL)
    (ROOT / 'docs' / 'llms-full.txt').write_text(FULL)
    index_snapshot = SOURCE / 'llms.txt'
    local_index = ROOT / 'docs' / 'llms.txt'
    if not index_snapshot.exists() and local_index.exists():
        index_snapshot.write_text(local_index.read_text())
    if index_snapshot.exists():
        local_index.write_text(index_snapshot.read_text().replace('https://exa.ai/docs', '/docs'))
    config_path = ROOT / 'docs.json'
    config = json.loads(config_path.read_text())
    redirects = config.setdefault('redirects', [])
    markdown_redirects = {'/docs/' + slug + '.md': '/docs/markdown/' + slug + '.txt' for slug in pages}
    markdown_redirects['/docs.md'] = '/docs/markdown/index.txt'
    for spec in ['exa-spec.yaml', 'exa-spec.json', 'team-management-spec.yaml']:
        original = ROOT / 'docs' / spec
        if original.exists():
            downloadable = ROOT / 'docs' / 'downloads' / (spec + '.txt')
            downloadable.parent.mkdir(exist_ok=True)
            downloadable.write_bytes(original.read_bytes())
            markdown_redirects['/docs/' + spec] = '/docs/downloads/' + spec + '.txt'
    existing = {item['source']: item for item in redirects}
    for source, destination in markdown_redirects.items():
        if source in existing:
            existing[source]['destination'] = destination
        else:
            redirects.append({'source': source, 'destination': destination})
    config_path.write_text(json.dumps(config, indent=2) + '\n')
    (SOURCE / 'navigation-metadata.json').write_text(json.dumps(NAV, indent=2) + '\n')
    print('Finished:', len(manifest), 'pages;', len(errors), 'errors', flush=True)
    if errors:
        raise SystemExit(1)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refresh', action='store_true', help='Re-download the published markdown for every inventoried page.')
    REFRESH = parser.parse_args().refresh
    main()
