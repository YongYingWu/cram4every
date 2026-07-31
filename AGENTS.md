# Repository Guidelines

## Project Structure & Module Organization

This is a dependency-free, single-page quiz app (Chinese civil-service exam practice). No build system or package manager.

- `index.html` — the entire app: markup, inline `<style>` (CSS custom properties), and inline `<script>` (vanilla JS, state in `localStorage`).
- `assets/index.json` — paper registry; one record per exam paper drives the homepage list.
- `assets/papers/<id>.json` — question banks; a top-level array of question objects (`num`, `section`, `stem`, `options`, `answer`, `analysis`).
- `assets/img/` — images referenced from question HTML.
- `tools/proxy-server.js` — zero-dependency Node static server with a `/proxy?url=...` CORS proxy, used by the in-app link-parsing feature.
- `README.md` — authoritative data schema reference (Chinese). Read it before editing question data.

## Build, Test, and Development Commands

```sh
node tools/proxy-server.js        # preferred: serves the app + CORS proxy at http://localhost:8322 (PORT env to override)
python -m http.server 8000        # fallback: static-only, link parsing unavailable
```

There is no compile, lint, or test step — changes take effect on refresh.

## Coding Style & Naming Conventions

- 2-space indentation everywhere; no tabs.
- JavaScript: `camelCase` functions/variables, `UPPER_SNAKE` for globals (e.g., `PQ_KEY`), single quotes; CommonJS in `tools/`.
- CSS: reuse `:root` variables (`--brand`, `--line`, etc.) instead of hardcoded colors; kebab-case class names (`.practice-panel`).
- Paper IDs: lowercase letters, digits, hyphens — e.g., `2026-fujian-xingce`, `xingguang-2491`. The ID names the registry record, the paper file, and the `localStorage` key (`quiz_<id>`).
- Question text is HTML fragments: `<br>` for line breaks, `<table class="qtable">` for tables, `<img src="assets/img/...">` for figures. Omit question numbers and A/B/C/D prefixes — the page renders them.

## Testing Guidelines

No automated tests exist. Before submitting:

1. Validate JSON: `python -m json.tool assets/papers/<id>.json`.
2. Confirm `total` in `assets/index.json` equals the question array length.
3. Confirm each `answer` letter matches its `options` index (`"D"` = `options[3]`).
4. Load the page and manually check home list, mock-exam grading, and practice-mode progress.

## Commit & Pull Request Guidelines

History uses short lowercase subjects with an optional prefix and colon (`add: init agent`, `update: 2025`). Keep one paper or one fix per commit. PRs should state what changed, how it was verified (checks above), and include a screenshot for any UI change in `index.html`.
