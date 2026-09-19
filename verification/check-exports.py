#!/usr/bin/env python3
"""Check that local public documentation downloads return their exact payloads."""
import concurrent.futures
import hashlib
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
cases = {
    '/docs/llms.txt': 'docs/llms.txt',
    '/docs/llms-full.txt': 'docs/llms-full.txt',
    '/docs/exa-spec.yaml': 'docs/exa-spec.yaml',
    '/docs/exa-spec.json': 'docs/exa-spec.json',
    '/docs/team-management-spec.yaml': 'docs/team-management-spec.yaml',
    '/docs.md': 'source-snapshot/markdown/index.md',
    '/docs/index.md': 'source-snapshot/markdown/index.md',
    '/docs/search/quickstart.md': 'source-snapshot/markdown/search/quickstart.md',
    '/docs/reference/search.md': 'source-snapshot/markdown/reference/search.md',
}

def check(case):
    url, expected = case
    process = subprocess.run(['curl', '-sSL', '--max-time', '45', '-w', '\n%{http_code}', 'http://localhost:3000' + url], capture_output=True)
    payload, separator, status = process.stdout.rpartition(b'\n')
    source = (ROOT / expected).read_bytes()
    return {'url': url, 'status': status.decode(), 'bytes': len(payload), 'matches_source': payload == source, 'passed': status == b'200' and payload == source, 'sha256': hashlib.sha256(payload).hexdigest(), 'error': process.stderr.decode()}

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    result = list(pool.map(check, cases.items()))
report = {'checks': result, 'passed': all(item['passed'] for item in result)}
(ROOT / 'verification' / 'exports-report.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
raise SystemExit(0 if report['passed'] else 1)
