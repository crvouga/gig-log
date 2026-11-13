#!/usr/bin/env python3
"""Import original lines; preserve IDs and enrichment on subsequent imports."""
import json, re, datetime, hashlib
from pathlib import Path
root = Path(__file__).resolve().parent.parent
raw = (root/'gigs.txt').read_bytes()
text = raw.decode('utf-8')
assert '\r' not in text, 'Use LF endings'
lines = text.splitlines()
path = root/'data/gigs.json'
old = json.loads(path.read_text()) if path.exists() else {'gigs': [], 'entities': []}
by_text = {}
for gig in old['gigs']:
    by_text.setdefault(gig['text'], []).append(gig)
used = {g['id'] for g in old['gigs']}
gigs = []
for line in lines[2:]:
    existing = by_text.get(line, [])
    if existing:
        gigs.append(existing.pop(0))
        continue
    match = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4}|\d{2})(?=\s|$)', line)
    date = None
    if match:
        m,d,y = map(int, match.groups())
        try: date = datetime.date(y+2000 if y<100 else y,m,d).isoformat()
        except ValueError: pass
    base = 'gig-' + hashlib.sha256(line.encode()).hexdigest()[:12]
    identifier = base
    n = 2
    while identifier in used:
        identifier = f'{base}-{n}'; n += 1
    used.add(identifier)
    gigs.append({'id': identifier, 'date': date, 'text': line, 'links': [], 'entityIds': [], 'tags': [], 'notes': ''})
remaining = [g for values in by_text.values() for g in values]
assert not remaining, 'Existing lines changed or removed. Update their text explicitly in data/gigs.json first to preserve IDs and metadata.'
path.write_text(json.dumps({'version':1,'title':lines[0],'gigs':gigs,'entities':old['entities']},ensure_ascii=False,indent=2)+'\n')
print(f'Synced {len(gigs)} gigs')
