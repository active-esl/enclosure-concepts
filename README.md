# Active-ESL — enclosure concepts (archived)

**Status: GitHub Archive — read-only.** Do not push new gallery tips here.

## Canonical (use these)

| | URL |
|--|-----|
| **Canonical site repo** | https://github.com/active-esl/enclosure-concepts-site |
| **Live share (Cloudflare Worker)** | https://enclosure-concepts-site.ajlennon.workers.dev/ |
| **Active POE Inspect** | https://enclosure-concepts-site.ajlennon.workers.dev/handheld-eth/assembly.html |
| **Pages (may lag tip)** | https://active-esl.github.io/enclosure-concepts-site/ |
| **Baseline tags note** | [NOTE-archive-baseline-tags.md](https://github.com/active-esl/enclosure-concepts-site/blob/main/NOTE-archive-baseline-tags.md) on the site repo |

| Concept | Inspect (Worker) |
|---------|------------------|
| Active Slim | https://enclosure-concepts-site.ajlennon.workers.dev/handheld/assembly.html |
| Active POE | https://enclosure-concepts-site.ajlennon.workers.dev/handheld-eth/assembly.html |
| Active Eink | https://enclosure-concepts-site.ajlennon.workers.dev/eink-imx93/assembly.html |

## Why this repo still exists

Keeps **git history**, **PR/Actions history**, and the four `test/eth-*` baseline
tags (`test/eth-poe-baseline-20260802`, `test/eth-assemble-baseline-20260802`,
`test/eth-assemble-baseline-20260803`, `test/eth-jack-wall-good-20260803`).
Site history is a separate snapshot (no shared SHAs) — tags stay here.

Do **not** use jsDelivr for this gallery (HTML as `text/plain` + `nosniff`).
GitHub Pages on this archive is disabled. Org Pages for the site repo may lag —
CF Worker is the share path.

**Local dry-fit (`:8770`):** may still use `/data_drive/esl/enclosure-concepts`
as the tip publish tree; git push/share goes to `enclosure-concepts-site`.
