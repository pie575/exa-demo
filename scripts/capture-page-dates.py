#!/usr/bin/env python3
"""Capture published modification labels omitted from Mintlify's MDX export."""
import concurrent.futures
import hashlib
import html
import json
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'source-snapshot/manifest.json').read_text())


def capture(entry):
    response = subprocess.run(
        ['curl', '-fsSL', '--retry', '2', '--max-time', '40', entry['source']],
        check=True, capture_output=True,
    ).stdout
    source = response.decode()
    match = re.search(r'<div class="pt-4 pb-16 text-sm text-gray-500 dark:text-gray-400">(Last modified on.*?)</div>', source)
    label = html.unescape(re.sub(r'<[^>]+>', '', match.group(1))).strip() if match else None
    return {
        'path': entry['source'].removeprefix('https://exa.ai').rstrip('/'),
        'source': entry['source'],
        'label': label,
        'source_html_sha256': hashlib.sha256(response).hexdigest(),
        'source_fragment': match.group(0) if match else None,
    }


with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
    dates = list(pool.map(capture, manifest['pages']))
result = {'pages': sorted(dates, key=lambda item: item['path'])}
(ROOT / 'source-snapshot/page-dates.json').write_text(json.dumps(result, indent=2) + '\n')
(ROOT / 'docs/page-dates.txt').write_text(json.dumps({item['path']: item['label'] for item in dates if item['label']}, indent=2) + '\n')
print(f"Captured {len(dates)} pages; {sum(bool(item['label']) for item in dates)} modification labels.")
