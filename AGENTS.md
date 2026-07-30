# Repository Guidelines

## Project Structure & Module Organization

This is a dependency-free, single-page quiz app (Chinese civil-service exam practice). There is no build system or package manager.

- `index.html` — the entire application: markup, inline `<style>` (CSS custom properties), and inline `<script>` (vanilla JS, state in `localStorage`).
- `assets/index.json` — paper registry; one record per exam paper drives the homepage list.
- `assets/papers/<id>.json` — question banks; a top-level array of question objects (`num`, `section`, `stem`, `options`, `answer`, `analysis`).
- `assets/img/` — images referenced from question HTML.
- `README.md` — authoritative data schema reference (Chinese). Read it before editing question data.

## Build, Test, and Development Commands

```sh
python -m http.server 8000   # serve locally; required since fetch() fails on file://
```

Open `http://localhost:8000`. There is no compile, lint, or test step — changes take effect on refresh.

## Coding Style & Naming Conventions

- 2-space indentation everywhere; no tabs.
- JavaScript: `camelCase` functions/variables, `UPPER_SNAKE` for globals (e.g., `PQ_KEY`), single quotes.
- CSS: use existing `:root` variables (`--brand`, `--line`, etc.) instead of hardcoded colors; class names are kebab-case (`.practice-panel`).
- Paper IDs: lowercase letters, digits, hyphens only — e.g., `2026-fujian-xingce`. The same ID names the registry record, the paper file, and its `localStorage` key (`quiz_<id>`).
- Question text is HTML fragments: `<br>` for line breaks, `<table class="qtable">` for tables, `<img src="assets/img/...">` for figures. Do not include question numbers or A/B/C/D prefixes — the page renders them.

## Testing Guidelines

No automated tests exist. Before submitting:

1. Validate JSON: `python -m json.tool assets/papers/<id>.json`.
2. Confirm `total` in `assets/index.json` equals the question array length.
3. Confirm each `answer` letter matches the correct `options` index (`"D"` = `options[3]`).
4. Load the page and manually verify home list, mock-exam grading, and practice mode progress.

## Commit & Pull Request Guidelines

History is minimal (`init`, `Initial commit`), so follow these conventions: short imperative subjects (`add 2026-hubei paper`, `fix answer for q42`); one paper or one fix per commit. PRs should state what changed, how it was verified (which checks above), and include a screenshot for any UI change in `index.html`.
