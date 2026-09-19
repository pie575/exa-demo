#!/usr/bin/env python3
"""Summarize measured production/local parity without claiming pixel identity."""
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageStat
root=Path(__file__).resolve().parent
records=[]
for path in sorted((root/'all-pages').glob('[0-9]*.json')):
    item=json.loads(path.read_text())
    a,b=item['production'],item['local']
    row={'id':item['id'],'path':item['path'],'geometryDeltas':item['deltas'],'bodyTextEqual':a.get('bodyText')==b.get('bodyText'),'localErrors':b.get('errors',[]),'localBrokenImages':b.get('brokenImages',[])}
    if a.get('geometry',{}).get('#content-area') and b.get('geometry',{}).get('#content-area'):
        row['contentHeightDelta']=round(b['geometry']['#content-area']['height']-a['geometry']['#content-area']['height'],3)
    image_a=root/'all-pages'/f"{item['id']}-production.png"
    image_b=root/'all-pages'/f"{item['id']}-local.png"
    if image_a.exists() and image_b.exists():
        with Image.open(image_a) as left, Image.open(image_b) as right:
            diff=ImageChops.difference(left.convert('RGB'),right.convert('RGB'))
            row['meanAbsolutePixelDifference']=round(sum(ImageStat.Stat(diff).mean)/3,4)
            channels=diff.split();maximum=ImageChops.lighter(ImageChops.lighter(channels[0],channels[1]),channels[2]);hist=maximum.histogram()
            row['pixelsDifferingOver3Percent']=round(sum(hist[4:])*100/(left.width*left.height),4)
    records.append(row)
summary={'pages':len(records),'matchingMeasuredGeometry':sum(not p['geometryDeltas'] for p in records),'matchingFullContentHeight':sum(abs(p.get('contentHeightDelta',0))<=1 for p in records),'exactBodyText':sum(p['bodyTextEqual'] for p in records),'localRuntimeErrors':sum(len(p['localErrors']) for p in records),'brokenVisibleImages':sum(len(p['localBrokenImages']) for p in records),'scope':'Desktop viewport 1512x982; content header, sidebar, navbar and TOC bounds; full content height; visible media; runtime errors; screenshot pixel analysis. API complete schema text checked separately. Pixel metrics include runtime controls and live content.','pagesDetail':records}
(root/'visual-summary.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps({k:v for k,v in summary.items() if k!='pagesDetail'},indent=2))
