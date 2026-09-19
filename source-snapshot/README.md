# Exa production documentation snapshot

The `markdown/` files are the unmodified public responses from each Exa
documentation page's `.md` URL. They retain custom MDX component implementations,
JSX attributes, interactive examples, and embedded OpenAPI definitions that the
combined `llms-full.txt` export omits or simplifies.

`manifest.json` inventories all 159 source pages and their SHA-256 checksums.
`page-metadata.json` preserves the corresponding production page metadata.
`production-docs-config.json` preserves the production site's embedded
configuration, and `navigation-metadata.json` preserves the documentation tab's
original navigation metadata. The complete local navigation is in root
`docs.json` and is independently checked against the page inventory.

`assets.json` records the source URL, local path, size, and SHA-256 checksum for
112 downloaded media, font, and schema URLs. `asset-replacements.json` records
their local URL mapping.

From the repository root, `python3 scripts/import-content.py` rebuilds native
MDX from these snapshots without downloading page content. Use `--refresh` to
download current markdown for the inventoried source pages. Run
`python3 scripts/mirror-assets.py` to restore missing media from production.

The conversion preserves production page metadata and changes only what local
hosting requires: `/docs` route prefixes, local asset URLs, homepage basepath
helpers, and native OpenAPI frontmatter in place of the markdown export's
generated schema appendix. The homepage is `docs.mdx`, so it resolves at `/docs`.

The Agent examples page includes a seven-tab spreadsheet preview wrapped in a
production `Visibility` component. Its individual Markdown export omits that
component, so `fragments/agent-examples-preview.html` preserves the exact rendered
production fragment with provenance in the adjacent JSON file. The importer
converts that fragment to JSX, preserving its native radio-button interactions.

For API pages, the importer removes the complete exported description from the
body because Mintlify already renders it from frontmatter. This includes later
paragraphs that the hosted Markdown export emits without a blockquote prefix.
Authored cards, notices, and examples remain in the page body.

Local Markdown and schema download URLs redirect to byte-identical `.txt` copies
under `docs/markdown/` and `docs/downloads/`, because Mintlify's development server
does not directly serve `.md`, `.yaml`, or `.json` assets at those public URLs.

`page-dates.json` records the published modification labels, exact HTML fragments,
source URLs, and response hashes for all 159 pages. The 85 visible date labels
are served from `docs/page-dates.txt` and restored by the local preview script;
they are production dates, not local file timestamps. Refresh them with
`python3 scripts/capture-page-dates.py`.
