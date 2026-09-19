#!/usr/bin/env python3
"""Build an offline full-text index for the local documentation preview."""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
pages = []
files = sorted((ROOT / 'docs').rglob('*.mdx'))
if (ROOT / 'docs.mdx').exists():
    files.append(ROOT / 'docs.mdx')
for path in files:
    text = path.read_text()
    header, body = text[4:].split('\n---\n', 1)
    meta = {}
    for line in header.splitlines():
        if ': ' in line:
            key, value = line.split(': ', 1)
            try:
                meta[key] = json.loads(value)
            except json.JSONDecodeError:
                meta[key] = value.strip('"\'')
    # Component source is implementation detail, not searchable documentation.
    body = re.sub(r'export const .*?\n};\n', '', body, flags=re.S)
    body = re.sub(r'<[^>]+>', ' ', body)
    body = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', body)
    body = re.sub(r'[#*`|{}]', ' ', body)
    body = re.sub(r'\s+', ' ', body).strip()
    route = '/' + str(path.relative_to(ROOT)).removesuffix('.mdx')
    if route == '/docs/index':
        route = '/docs'
    description = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', meta.get('description', ''))
    description = re.sub(r'\s+', ' ', description.replace('`', '').replace('**', '')).strip()
    pages.append({'title': meta.get('title', path.stem), 'description': description, 'url': route, 'text': body})
target = ROOT / 'docs/search-index.json'
target.write_text(json.dumps(pages, ensure_ascii=False, separators=(',', ':')) + '\n')
# Mintlify's local CLI serves text files but reserves JSON paths.
(ROOT / 'docs/search-index.txt').write_text(target.read_text())
script = ROOT / 'local-search.js'
behavior = re.sub(r'// BEGIN LOCAL SEARCH INDEX\n.*?// END LOCAL SEARCH INDEX\n', '', script.read_text(), flags=re.S)
if behavior != script.read_text():
    script.write_text(behavior)
print(f'Indexed {len(pages)} pages ({target.stat().st_size:,} bytes) at {target.relative_to(ROOT)}')
