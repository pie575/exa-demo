#!/usr/bin/env python3
"""Audit the imported documentation against its captured production inventory.

Optionally request every page from a running Mintlify instance with --url.
Only the Python standard library is required.
"""
import argparse
import concurrent.futures
import hashlib
import json
from pathlib import Path
import re
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]


def nav_pages(value):
    result = []
    if isinstance(value, dict):
        for key, child in value.items():
            if key == 'pages':
                for page in child:
                    if isinstance(page, str):
                        result.append(page)
                    else:
                        result.extend(nav_pages(page))
            elif isinstance(child, (list, dict)):
                result.extend(nav_pages(child))
    elif isinstance(value, list):
        for child in value:
            result.extend(nav_pages(child))
    return result


def frontmatter(text):
    if not text.startswith('---\n'):
        return {}, text
    raw, body = text[4:].split('\n---\n', 1)
    result = {}
    for line in raw.splitlines():
        if ': ' in line:
            key, value = line.split(': ', 1)
            try:
                result[key] = json.loads(value)
            except json.JSONDecodeError:
                result[key] = value.strip('"\'')
    return result, body


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', help='Running Mintlify base URL, e.g. http://localhost:3000')
    parser.add_argument('--output', default='verification/content-audit.json')
    args = parser.parse_args()
    source = (ROOT / 'source-snapshot/llms-full.txt').read_text()
    expected = set(re.findall(r'^Source: https://exa.ai/docs/(\S+)\s*$', source, re.M))
    config = json.loads((ROOT / 'docs.json').read_text())
    nav = nav_pages(config['navigation'])
    actual = {str(p.relative_to(ROOT / 'docs')).removesuffix('.mdx') for p in (ROOT / 'docs').rglob('*.mdx')}
    if (ROOT / 'docs.mdx').exists():
        actual.add('index')
    expected_nav = {'docs' if p == 'index' and (ROOT / 'docs.mdx').exists() else 'docs/' + p for p in expected}
    report = {
        'source_pages': len(expected),
        'local_pages': len(actual),
        'navigation_entries': len(nav),
        'missing_pages': sorted(expected - actual),
        'extra_pages': sorted(actual - expected),
        'missing_navigation': sorted(expected_nav - set(nav)),
        'unexpected_navigation': sorted(set(nav) - expected_nav),
        'broken_internal_links': [],
        'missing_assets': [],
        'invalid_api_references': [],
        'unconverted_api_fences': [],
        'source_checksum_errors': [],
    }
    # Retained raw responses make content provenance independently verifiable.
    manifest = json.loads((ROOT / 'source-snapshot/manifest.json').read_text())
    for entry in manifest['pages']:
        raw = ROOT / entry['markdown']
        if not raw.exists() or hashlib.sha256(raw.read_bytes()).hexdigest() != entry['sha256']:
            report['source_checksum_errors'].append(entry['markdown'])
    report['import_errors'] = manifest.get('errors', [])
    api_count = 0
    link_count = 0
    asset_count = 0
    for slug in sorted(actual):
        filename = ROOT / 'docs' / (slug + '.mdx')
        if slug == 'index' and (ROOT / 'docs.mdx').exists():
            filename = ROOT / 'docs.mdx'
        text = filename.read_text()
        header, body = frontmatter(text)
        if re.search(r'^````?ya?ml \S+ (?:GET|POST|PUT|PATCH|DELETE) /', body, re.M):
            report['unconverted_api_fences'].append(slug)
        if header.get('openapi'):
            api_count += 1
            ref = header['openapi']
            parts = ref.split()
            if len(parts) != 3:
                report['invalid_api_references'].append({'page': slug, 'reference': ref, 'reason': 'Expected schema, method, endpoint'})
            else:
                schema, method, endpoint = parts
                schema_file = ROOT / schema.lstrip('/')
                if not schema_file.exists():
                    report['invalid_api_references'].append({'page': slug, 'reference': ref, 'reason': 'Schema file missing'})
                else:
                    schema_text = schema_file.read_text()
                    operation = re.search(r'^  [\"\']?' + re.escape(endpoint) + r'[\"\']?:\s*\n(.*?)(?=^  [^ ]|\Z)', schema_text, re.M | re.S)
                    if not operation:
                        report['invalid_api_references'].append({'page': slug, 'reference': ref, 'reason': 'Endpoint missing from schema'})
                    elif not re.search(r'^    ' + re.escape(method.lower()) + r':\s*$', operation[1], re.M):
                        report['invalid_api_references'].append({'page': slug, 'reference': ref, 'reason': 'HTTP method missing from schema endpoint'})
        # Exclude code examples when checking authored navigational links.
        prose = re.sub(r'^(`{3,}|~{3,}).*?^\1\s*$', '', body, flags=re.M | re.S)
        for target in re.findall(r'(?:href=[\"\']|\]\()([^\"\'\s)]+)', prose):
            if target.startswith(('#', '//', '{')) or urllib.parse.urlsplit(target).scheme:
                continue
            origin = 'http://localhost/docs/' + slug
            path = urllib.parse.unquote(urllib.parse.urlsplit(urllib.parse.urljoin(origin, target)).path).rstrip('/')
            if not path:
                continue
            link_count += 1
            local = ROOT / path.lstrip('/')
            if not any(p.exists() for p in [local, Path(str(local) + '.mdx'), local / 'index.mdx']):
                report['broken_internal_links'].append({'page': slug, 'target': target})
        for target in re.findall(r'(?:src=[\"\']|!\[[^\]]*\]\()(/[^\"\'\s)]+)', prose):
            asset_count += 1
            path = urllib.parse.unquote(urllib.parse.urlsplit(target).path)
            if not (ROOT / path.lstrip('/')).exists():
                report['missing_assets'].append({'page': slug, 'target': target})
    report['api_pages'] = api_count
    report['checked_internal_links'] = link_count
    report['checked_asset_references'] = asset_count
    if args.url:
        def request_page(slug):
            route = '/docs' if slug == 'index' else '/docs/' + slug
            url = args.url.rstrip('/') + route
            try:
                with urllib.request.urlopen(url, timeout=90) as response:
                    html = response.read().decode()
                    title = re.search(r'<title>(.*?)</title>', html, re.S)
                    title = title[1] if title else ''
                    failed = 'Page not found' in title or not title
                    return {'route': route, 'status': response.status, 'title': title, 'ok': not failed}
            except Exception as error:
                return {'route': route, 'ok': False, 'error': str(error)}
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            report['routes'] = list(pool.map(request_page, sorted(expected)))
        report['route_errors'] = [r for r in report['routes'] if not r['ok']]
    failure_keys = ['missing_pages', 'missing_navigation', 'unexpected_navigation', 'broken_internal_links', 'missing_assets', 'invalid_api_references', 'unconverted_api_fences', 'source_checksum_errors', 'import_errors', 'route_errors']
    report['passed'] = not any(report.get(key) for key in failure_keys)
    output = ROOT / args.output
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({k: v if not isinstance(v, list) else len(v) for k, v in report.items() if k != 'routes'}, indent=2))
    raise SystemExit(0 if report['passed'] else 1)


if __name__ == '__main__':
    main()
