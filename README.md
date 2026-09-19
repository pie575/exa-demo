# Exa documentation — local Mintlify

A local copy of [Exa's production documentation](https://exa.ai/docs), captured September 18, 2026. Includes all 159 published pages, the original navigation, 69 OpenAPI reference pages, Exa's custom components, styles, scripts, fonts, and documentation media.

## Run

Requires Node.js 20+, pnpm, and Python 3.

```sh
pnpm install
pnpm dev
```

Open **http://localhost:3000/docs**. Production `/docs/...` paths are preserved. To use another port: `pnpm exec mint dev --no-open --port 3333`.

## Project

- `docs.json`: production theme, navigation, branding, and API configuration.
- `docs.mdx`: documentation homepage; `docs/`: all other pages, OpenAPI specifications, and media.
- `styles.css`, `tokens.css`, and the root interaction scripts: recovered production source.
- `fonts/`: local copies of the production fonts.
- `source-snapshot/`: original published Markdown, navigation metadata, and source/asset checksum manifests.
- `verification/`: reproducible content, browser, and visual comparison checks.

## Verify

```sh
pnpm validate
pnpm check:links
python3 verification/audit-content.py
```

Browser capture scripts use Playwright and Google Chrome. The comparison reports distinguish actual layout/content issues from local-preview limitations.

See the [verification report](verification/REPORT.md) and [blind A/B comparison gallery](verification/blind/index.html) for evidence and reproduction commands.

## Sources and local behavior

The content comes directly from Exa's published `.md` pages and [full documentation export](https://exa.ai/llms-full.txt). The individual Markdown pages preserve custom JSX omitted from the combined export. Original source responses are retained for auditing; see [source provenance](source-snapshot/README.md).

The local preview uses the genuine Mintlify renderer. Local documentation search works without a Mintlify account. The hosted AI assistant is replaced by a documentation search launcher; it does not generate AI answers. External dashboard, playground, support, and integration links still point to their real destinations. Executing API examples requires your own Exa credentials.

Rebuild content from the checked-in snapshots with `python3 scripts/import-content.py`, then `python3 scripts/mirror-assets.py`. Pass `--refresh` to the importer to download fresh versions of the snapshotted pages. A production navigation change requires updating the snapshot inventory too.
