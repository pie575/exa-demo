# Verification against Exa production

Production snapshot: September 18, 2026. Local preview: http://localhost:3000/docs.

| Check | Result | Evidence |
| --- | --- | --- |
| Source inventory and navigation | 159 of 159 pages; no missing or extra pages | [Content audit](content-audit.json) |
| HTTP page rendering | 159 of 159 routes render | [Route audit](route-audit.json) |
| Full rendered API content | 69 of 69 match production after whitespace normalization | [API comparison](api-content-audit.json) |
| Internal links and API references | 378 authored links and all 69 schema paths/methods pass | [Content audit](content-audit.json) |
| Published downloads | All 9 tested Markdown, LLM, and schema exports resolve with matching payloads | [Export audit](exports-report.json) |
| Interactive behavior | All 11 browser checks pass, no page errors | [Interaction audit](interaction-audit.json) |
| Desktop layout | All 159 routes match measured geometry and full content height; no runtime errors or broken visible images | [Visual summary](visual-summary.json) |
| Mobile and dark mode | 10 comparisons across 5 representative routes; measured layouts match, no horizontal overflow or broken visible images | [Mobile/theme comparison](mobile-theme/report.json) |
| Mintlify build and links | `pnpm validate` and `pnpm check:links` pass | Reproducible commands below |

The interaction checks include all homepage example selectors, local full-text
search and keyboard navigation, empty results, Escape, clipboard copying, theme
switching, API schema rendering, all seven Agent spreadsheet tabs, and mobile
navigation/search.

## Blind visual review

[Open the 159-page A/B comparison gallery](blind/index.html). Each page's two
screenshots are shuffled independently. The gallery stores A/B/tie preferences
in the browser. The four representative desktop/mobile pairs were also reviewed
without consulting the identity key: [final review](blind/final-review.md).
Earlier independent reviews and matching screenshots are archived in
`blind/review-round-2/`.

The final representative reviews found no meaningful aesthetic advantage for
either version. Two final representative pairs are bitmap-identical; the other
two differ at only 8 and 1 pixels respectively at the recorded threshold
([pixel measurements](representative-pixel-comparison.json)). These are checks
of the captured viewports, not a claim of universal pixel identity or
hosted-service equivalence. Across all 159 pages, body text matches on 158; the
remaining difference is the live status page's check timestamp.

## Fidelity details

The import preserves the production theme, navigation, custom styles and
scripts, fonts, page metadata, API specifications, and original MDX components.
It also restores the Agent Examples spreadsheet omitted from the Markdown
export, and the 85 published modification labels omitted by the local renderer.
Original responses and checksums are retained in `source-snapshot/`.

Exa's hosted AI assistant is unavailable in Mintlify's local preview. Its local
controls open a working documentation search instead. External dashboards and
API playground destinations remain external. Markdown and schema download URLs
use redirects to identical `.txt` payloads because the native development server
does not serve those file extensions directly. Live status timestamps and
animated media can differ between captures.

## Reproduce

```sh
pnpm validate
pnpm check:links
pnpm audit:content
pnpm dev
# In another terminal, with the preview running:
python3 verification/audit-content.py --url http://localhost:3000 --output verification/route-audit.json
python3 verification/check-exports.py
node verification/audit-interactions.mjs
node verification/audit-api-content.mjs
node verification/compare-all.mjs
node verification/mobile-theme-check.mjs
node verification/build-blind-gallery.mjs
```

Browser checks require Google Chrome and use the installed Playwright package.
The all-page screenshots are local generated artifacts excluded from Git;
regenerate them before using the gallery in a fresh checkout.
