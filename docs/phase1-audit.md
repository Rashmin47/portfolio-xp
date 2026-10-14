# Phase 1 – Codebase Audit

> Source: `audit/snapshot.txt` (2026-10-14) + `package.json`. No other files opened.

| # | Area | Finding | Action | Effort |
|---|------|---------|--------|--------|
| 1 | **Framework & router** | Next 15.5.5 / App Router / React 19 / Turbopack. Only one route (`app/page.js`); no `/projects`, `/lab`, `/roadmap`, `/notes`, `/contact`, `/ventures`, `/about` pages exist yet. | **Repair** – add all pages listed in AGENTS.md | L |
| 2 | **Styling – Tailwind** | Tailwind v4 + `@tailwindcss/postcss` installed. AGENTS.md says "prefer plain CSS"; design tokens are not Tailwind-based. | **Replace** – migrate to plain CSS with design-token custom properties; remove `tailwindcss`, `@tailwindcss/postcss`, `tailwind.config.mjs` | M |
| 3 | **Styling – globals.css** | Only 24 lines; no design tokens, no reset, no typography scale. | **Repair** – rebuild with token variables, reset, responsive type | M |
| 4 | **Fonts** | Using `Outfit` + `Ovo` via `next/font/google`. AGENTS.md specifies Bricolage Grotesque / Instrument Sans / JetBrains Mono, self-hosted, Latin subset. Also: font import erroneously appears in `postcss.config.mjs` (line 1). | **Replace** – swap to correct fonts; remove stray import from PostCSS config | S |
| 5 | **Fonts – README** | README still references default "Geist" font from create-next-app scaffold. | **Repair** – rewrite README for this project | S |
| 6 | **SEO / metadata** | Single `metadata` export in `layout.js`. No per-page titles, no meta descriptions, no canonical, no OG image, no JSON-LD (`Person`, `ProfilePage`, `Article`), no `sitemap.xml`, no `robots.txt`. | **Repair** – add all SEO artefacts per AGENTS.md | M |
| 7 | **Assets – large PNGs** | 4 work images (420–576 KB each, 2.1 MB total in `public/`). No compression, no `next/image` usage confirmed. | **Repair** – convert to WebP/AVIF, confirm `<Image>` usage, keep originals out of repo | S |
| 8 | **Assets – favicon** | Default Next.js favicon in `app/favicon.ico`. | **Replace** – create project-specific favicon + OG image | S |
| 9 | **Env / secrets** | `.env` contains `WEB3ACCESSKEY` (Web3Forms API key). `.env` is gitignored ✓. No `.env.example` for onboarding. | **Repair** – add `.env.example` with placeholder name only | S |
| 10 | **Deployment / CI** | `next.config.mjs` is empty. No CI workflow, no Vercel/other config detected, no preview deploy. | **Repair** – add GitHub Actions CI (lint + build), configure `next.config.mjs` (images domains, headers, etc.) | M |
| 11 | **Animation library** | `motion` (Framer Motion v12) is a runtime dependency. AGENTS.md says "No animation library unless approved." | **Keep / confirm** – get explicit approval to keep or remove | S |
| 12 | **Placeholder content** | Form fields in `Contact.jsx` use `placeholder` attributes (normal UX, not lorem). No lorem ipsum detected. | **Keep** – form placeholders are fine | – |
| 13 | **Broken / malformed links** | `https://github.https://www.linkedin.com/in/rashmin-sharma-656bb332a/` – GitHub + LinkedIn URLs mangled together. `http://localhost:3000](http://localhost:3000` – Markdown-formatted URL leaked into source. | **Repair** – fix both; likely in a component or README | S |
| 14 | **Boilerplate links** | 6 Vercel/Next.js scaffold links still in README / source (`vercel.com/new`, `nextjs.org/docs`, etc.). | **Remove** – clean out create-next-app boilerplate | S |
| 15 | **Upgrade risks** | React 19.1 is pinned (no caret), Next 15.5 uses caret. `motion@^12` may pull breaking minor bumps. Low risk today but pin or verify ranges before shipping. | **Repair** – align version strategies (pin all or caret all) | S |
| 16 | **Components** | 7 component files in `components/`. No sub-directories, no barrel file. Unknown whether any are unused or duplicate. | **Keep** – evaluate during Phase 2 build-out (check `components/*.jsx`) | S |
| 17 | **Uncommitted files** | 12 uncommitted files. Risk of losing work. | **Repair** – commit or stash before proceeding | S |

---

## Open Questions (max 5)

1. **Keep `motion` (Framer Motion)?** AGENTS.md forbids unapproved animation libs. Should we keep it for page transitions / micro-animations, or remove it and use CSS animations only?
2. **Work images (`public/work-*.png`)** – Are these final project screenshots or temporary placeholders? Affects whether we optimise in-place or replace entirely. Check `components/Work.jsx` (or similar) for context.
3. **Web3Forms (`WEB3ACCESSKEY`)** – Is this the permanent contact-form backend, or will it be replaced? Affects whether we build a `/contact` page around it or plan a different integration.
4. **Deployment target** – Vercel, self-hosted, or other? Needed to set up CI and `next.config.mjs` correctly.
5. **Classic-view fallback** – AGENTS.md requires a visible "Classic view" fast lane. Is the current single-page layout intended to *become* the classic view, or is it a separate build?
