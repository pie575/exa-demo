#!/usr/bin/env python3
"""Mirror published documentation media and OpenAPI sources for local use."""
import concurrent.futures
import hashlib
import json
import pathlib
import re
import subprocess
from urllib.parse import urlsplit

ROOT = pathlib.Path(__file__).resolve().parents[1]
FILES = list((ROOT / 'docs').rglob('*.mdx')) + [ROOT / 'docs.mdx']
assets = {}
replacements = {}

def add(url, local):
    assets[url] = local
    replacements[url] = '/' + local

DISCOVERY = list((ROOT / 'source-snapshot' / 'markdown').rglob('*.md')) + [ROOT / 'source-snapshot' / 'page-metadata.json', ROOT / 'source-snapshot' / 'production-docs-config.json']
for path in DISCOVERY:
    text = path.read_text()
    for url in re.findall(r'https://(?:mintcdn\.com|mintlify\.s3\.us-west-1\.amazonaws\.com)/[^\s"\'<>)}]+', text):
        remote = urlsplit(url).path
        if '/images/' in remote:
            local = 'docs/images/' + remote.split('/images/', 1)[1]
        elif '/logo/' in remote:
            local = 'docs/logo/' + remote.split('/logo/', 1)[1]
        else:
            raise RuntimeError('Unknown media path ' + remote)
        add(url, local)
    for image in re.findall(r'["\'](/(?:docs/)?images/[^"\']+)["\']', text):
        local = 'docs/' + image.removeprefix('/docs/').lstrip('/')
        add('https://exa.ai/' + local, local)

for font in ['ABCDiatype-Regular', 'ABCDiatype-Medium', 'ABCDiatype-Bold', 'GeistMono-Regular']:
    add('https://exa.ai/fonts/' + font + '.woff2', 'fonts/' + font + '.woff2')
for spec in ['exa-spec.yaml', 'exa-spec.json', 'team-management-spec.yaml', 'llms.txt']:
    add('https://exa.ai/docs/' + spec, 'docs/' + spec)

def fetch(item):
    url, local = item
    path = ROOT / local
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists() or not path.stat().st_size:
        subprocess.run(['curl', '-fsSL', '--retry', '3', '--max-time', '90', url, '-o', str(path)], check=True, capture_output=True)
    return {'source': url, 'path': local, 'bytes': path.stat().st_size, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}

manifest = []
errors = []
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
    futures = {pool.submit(fetch, item): item for item in assets.items()}
    for future in concurrent.futures.as_completed(futures):
        try:
            manifest.append(future.result())
        except Exception as error:
            item = futures[future]
            errors.append({'source': item[0], 'path': item[1], 'error': str(error)})
            print('ERROR', item[0], error, flush=True)
        if (len(manifest) + len(errors)) % 25 == 0:
            print('Mirrored', len(manifest), '/', len(assets), flush=True)

successful = {item['source'] for item in manifest}
for path in FILES:
    text = path.read_text()
    for remote, local in replacements.items():
        if remote in successful:
            text = text.replace(remote, local)
    # Native local routes include /docs; generated production basepath helpers
    # assume a deployment prefix that is absent in a native local Mintlify server.
    text = text.replace('const base = docsBase();', 'const base = "";')
    text = re.sub(r'((?:image|href):\s*")/(?!docs/)([^"\n]+)(")', r'\1/docs/\2\3', text)
    text = text.replace('](/integrations/openai-sdk#answer)', '](/docs/integrations/openai-sdk#answer)')
    if path.relative_to(ROOT).as_posix() == 'docs/websets/quickstart.mdx':
        text = text.replace('](./api/how-it-works)', '](/docs/websets/quickstart)')
    text = re.sub(r'(href=["\']|\]\()https://exa\.ai/docs(?=[/#"\')])', r'\1/docs', text)
    path.write_text(text)

(ROOT / 'source-snapshot' / 'assets.json').write_text(json.dumps({'assets': sorted(manifest, key=lambda v: v['path']), 'errors': errors}, indent=2) + '\n')
(ROOT / 'source-snapshot' / 'asset-replacements.json').write_text(json.dumps({k: v for k, v in replacements.items() if k in successful}, indent=2) + '\n')
print('Finished:', len(manifest), 'asset URLs;', len(errors), 'errors', flush=True)
if errors:
    raise SystemExit(1)
