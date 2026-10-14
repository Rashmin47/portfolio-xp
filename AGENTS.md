# Portfolio: standing instructions

Personal portfolio for Rashmin Sharma (software developer, Nepal; future founder).
Concept: **The Workshop**, a 3D desk where each object is a module. Full spec: `docs/phase-2-design.md`.

## Hard rules
- Content lives in server-rendered HTML pages. The 3D scene is only a way in and never the sole home of content.
- Every 3D hotspot links to a real page (`/projects`, `/lab`, `/roadmap`, `/notes`, `/contact`, `/ventures`, `/about`).
- Always provide a visible "Classic view" fast lane. Auto-fallback to classic on reduced motion, data saver, low memory or no WebGL.
- 3D code (three, @react-three/fiber, drei) is loaded with `dynamic(() => import(...), { ssr: false })` and only after the user enters the Workshop. It must never enter the homepage's initial bundle.
- Stack: Next.js App Router, JavaScript (.js/.jsx), Tailwind v4 with tokens in `@theme` (globals.css). No new dependency without asking. `motion` is approved for UI transitions only (LazyMotion + `m`, MotionConfig reducedMotion="user").
- Content (projects, roadmap, notes, ventures) lives in `data/*.js`; pages and 3D hotspots both read from it.
- Never print, log or commit secret values. Env vars: reference names only.
- No placeholder content, lorem ipsum, fake dashboards or invented facts. Unknown facts stay marked `[verify]`.

## SEO
- Each page: unique title (60 chars or fewer), meta description (155 or fewer), canonical URL, Open Graph image, one H1.
- Homepage H1 stays plain and searchable: name, role, place.
- JSON-LD: `Person` on `/`, `ProfilePage` on `/about`, `Article` on notes. Include `sameAs` for GitHub and LinkedIn.
- Maintain `sitemap` and `robots`. Internal links between projects, ventures and notes.

## Design tokens
`ink #0E1726`, `paper #F4F6FB`, `cobalt #2F5BEA`, `sky #62C0FF`, `signal #F2C81F` (the only accent, always with ink text), `board #2EA84B`, `night #0B1220`, `night-surface #131D33`, `muted #5B6578`.
Radius 14px. Hairline borders. No gradients (except scene sky), glass effects or glows.
Fonts: Bricolage Grotesque (display), Instrument Sans (body), JetBrains Mono (labels). Self-host, Latin subset, `font-display: swap`.

## Performance and accessibility
- Targets: scene 100k triangles or fewer, textures 2048px maximum and compressed, 3D lazy loaded, usable on a mid-range Android phone.
- WCAG AA contrast, visible focus ring (3px `signal`), keyboard access to every hotspot via a DOM list, `prefers-reduced-motion` respected.

## Working style (keep token use low)
- Read only the files needed for the task. Do not scan the whole repo. Use the paths given in the prompt.
- Make small, focused diffs. No unrelated refactors or reformatting.
- Do not restate the plan or the code in the reply. Report: files changed, one line each, and anything needing a decision.
- Run `npm run build` (and lint if configured) before saying a task is done. Report only failures.
- Ask one concise question when blocked instead of guessing.

## Phase status
Phase 1 (repo audit): in progress. Output: `docs/phase1-audit.md`.
