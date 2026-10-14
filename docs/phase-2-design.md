# The Workshop: Phase 2 Design Document

**Project:** Rashmin Sharma, personal portfolio rebuild
**Phase:** 2 of 6, design specification (no code yet)
**Concept:** The Workshop, a 3D desk and lab room where every object is a working module
**Foundation:** Existing Next.js repository and deployment, kept
**Status:** Draft for approval. Items marked **[verify]** need confirmation before they appear on the site.

---

## 1. Design principles

| # | Principle | What it means in practice |
|---|---|---|
| 1 | **Content lives in HTML, the 3D scene is a way in** | Every module has a real, indexable page. Nothing important exists only inside the canvas |
| 2 | **Evidence over decoration** | Real projects, real hardware, real data. No fake dashboards, no stock imagery, no skill percentages |
| 3 | **Every object earns its place** | If an object is not a module, a status indicator or a deliberate easter egg, it is removed |
| 4 | **Fast lane always visible** | A recruiter in a hurry reaches the best project in seconds, with or without 3D |
| 5 | **One accent, used with intent** | A single signal colour marks what is interactive. No gradient blobs, glass effects or decorative glows |
| 6 | **Specific beats generic** | Copy names real things. Phrases like "passionate developer" are not used |

---

## 2. Art direction

| Aspect | Decision |
|---|---|
| **Overall style** | Stylised low-poly, rounded forms, flat-shaded colour with baked soft lighting. Toy-like charm, but crisp and professional |
| **Reference** | The supplied hardware banner (propellers, laptop with block code, coffee cup, Raspberry Pi, LEDs) is used for object shapes and mood only. It is not reproduced **[verify origin and licence]** |
| **Default mood** | **Daylight workshop**: bright, cool-blue room, yellow accents |
| **Time-of-day system** | Lighting follows Kathmandu local time: day, golden evening, and a lamp-lit night variant. Visitors can override with a toggle |
| **Window** | Stylised Kathmandu skyline with distant hills; sky colour follows the time of day. It doubles as the live proof strip |
| **Camera** | Fixed eye-level three-quarter view of the desk. Orbit limited to about 30 degrees each way. Object clicks trigger smooth dolly-in moves, always with a clear "Back to desk" control |
| **Depth of field and effects** | None on mobile. At most a very light vignette on desktop. No bloom or heavy post-processing |
| **Founder touches** | A desk nameplate for ventures, a roadmap whiteboard, a few product sketches pinned to the wall. Community appears as one small wall badge |
| **Not allowed** | Neon, glassmorphism, particle storms, floating abstract shapes, stock 3D room assets left unmodified |

---

## 3. Palette and tokens

Values are starting points, estimated from the reference banner. They will be sampled and tuned in the prototype and checked against a 4.5:1 text contrast target during QA.

| Token | Hex | Used for |
|---|---|---|
| `ink` | `#0E1726` | Primary text on light surfaces, outlines |
| `paper` | `#F4F6FB` | Page background (a cool off-white, deliberately not warm paper) |
| `cobalt` | `#2F5BEA` | Primary brand colour, links, large shapes |
| `sky` | `#62C0FF` | Secondary surfaces, scene backdrop, highlights |
| `signal` | `#F2C81F` | **The single accent**: interactive hotspots, LEDs, active states. Always paired with `ink` text, never used as text on white |
| `board` | `#2EA84B` | Success and "live" status |
| `code-orange` | `#F5922F` | Code-block highlights only |
| `screen` | `#04376B` | Monitor and laptop screens |
| `night` | `#0B1220` | Dark mode and night-scene background |
| `night-surface` | `#131D33` | Cards and panels in dark mode |
| `muted` | `#5B6578` | Secondary text and metadata |

Rules: `signal` appears at most a few times per screen. Large areas use `paper`, `cobalt` or `sky`. Dark mode is supported on classic pages and follows the system setting.

---

## 4. Typography

Final choices are confirmed in the prototype after testing in real layouts. All fonts are open-licence, self-hosted, Latin-only subsets, with `font-display: swap` and system fallbacks.

| Role | Primary candidate | Alternative | Fallback stack |
|---|---|---|---|
| **Display and headings** | Bricolage Grotesque (variable) | Instrument Sans | `system-ui, sans-serif` |
| **Body** | Instrument Sans | Inter Tight | `system-ui, sans-serif` |
| **Labels, code, metadata** | JetBrains Mono | Geist Mono | `ui-monospace, monospace` |

| Style | Size (desktop / mobile) | Weight | Notes |
|---|---|---|---|
| Hero tagline | 72 / 40 px | 700 | Tight leading, slight negative tracking |
| H1 (page title) | 56 / 34 px | 700 | The SEO heading, kept visible |
| H2 | 36 / 26 px | 600 | |
| H3 | 24 / 20 px | 600 | |
| Body | 18 / 17 px | 400 | 65 to 75 character line length |
| Label (mono) | 13 / 12 px | 500 | Uppercase, wide tracking, used for dates, stack tags, object names |

---

## 5. Layout, spacing and motion

| Area | Rule |
|---|---|
| **Grid** | 12 columns on desktop, 4 on mobile, with generous but non-uniform vertical rhythm: tight in data areas, very open around the hero |
| **Spacing scale** | 4, 8, 12, 16, 24, 32, 48, 72, 112 px |
| **Corners** | 14 px radius for cards and panels, 999 px for chips. Echoes the rounded 3D forms |
| **Borders** | 1 px hairlines in `ink` at low opacity; no heavy shadows |
| **Motion durations** | 150 ms (feedback), 300 ms (panels), 600 to 900 ms (camera moves) |
| **Easing** | One easing curve across the site, a gentle ease-out |
| **Reduced motion** | Camera jumps instead of gliding, no idle animation, no auto-play. The classic view loads by default |
| **Hover and focus** | Hover: small lift or underline. Focus: a visible 3 px `signal` ring, always |
| **Mobile** | Single column; the scene is simplified or replaced by the static hero and classic view; contact is always reachable |

---

## 6. Scene design

### 6.1 Desk composition

Left to right: coffee mug on a coaster, the laptop in the centre, the Raspberry Pi to its right connected by a cable, LEDs in a small tray beside the Pi. Drone propellers are mounted on the back wall. Above the desk: the roadmap whiteboard. To one side: bookshelf, notebook on the desk edge, phone on a small stand. The window is behind the desk.

### 6.2 Objects, modules and camera moves

One consolidated map of what each object does.

| # | Object | Module | Camera move | Panel content | Classic page | Mini-interaction |
|---|---|---|---|---|---|---|
| 1 | Laptop screen | Shipped projects | Dolly into screen | Project index, then case study | `/projects`, `/projects/[slug]` | "Find the bug" challenge tab |
| 2 | Raspberry Pi | Experiments (Lab) | Close-up on board | Experiment cards and live demo | `/lab` | `gpio 17` toggles an LED; data pulse along the cable |
| 3 | Whiteboard | Roadmap (Now / Next / Later) | Face-on zoom | Roadmap items with reasoning | `/roadmap` | Reveal reasoning per item |
| 4 | Notebook | Notes | Top-down | Article previews | `/notes`, `/notes/[slug]` | Page flip |
| 5 | Phone | Contact | Tilt up | Email, LinkedIn, GitHub | `/contact` | Copy email, screen wakes on approach |
| 6 | Desk nameplate | Ventures | Close-up | Company and product story **[verify]** | `/ventures` | Plate reveals one-line mission |
| 7 | Bookshelf | How I think and stack | Pull-out view | Principles and technologies with where used | `/about#how-i-think` | Each book is one principle |
| 8 | Laptop terminal | Ask the portfolio | Over-the-shoulder | Terminal chat limited to my own content | In-page tool | Commands like `projects`, `roadmap`, `hire` |
| 9 | Window | Live proof strip | Hover only | Kathmandu time, latest commit, "currently building" | Same data in HTML | Day and night follow local time |
| 10 | Wall badge | Community (minimal) | Close-up | One short note on community work | `/about#community` | None |

Supporting props that are not modules: propellers (spin faster with the servo value), mug (steam, easter egg), cable (signal pulse), LED tray (progress indicator).

### 6.3 Explorer progress

Ten LEDs (five yellow, five red, as in the reference) map to the ten modules. Each lights up when the visitor opens its module. Progress is stored in the browser. Completing all ten reveals a hidden terminal command and a short thank-you note.

### 6.4 Performance budget (proposed, to be validated on a budget Android phone)

| Item | Target |
|---|---|
| Total scene triangles | 100,000 or fewer |
| Hero objects (laptop, Pi, whiteboard, notebook, phone) | 5,000 to 15,000 triangles each |
| Textures | One or two atlases, 2048 px maximum, compressed |
| Total compressed scene payload | A few MB, loaded lazily after the homepage |
| Frame rate | 60 fps on desktop, 30 fps minimum on mid-range phones |
| Failure behaviour | If 3D fails or is too slow, the classic view loads automatically |

---

## 7. Hero copy options

Structure: the **H1 stays plain and searchable** (name, role, place). The **creative tagline** sits beside or below it. The static Workshop render is the hero image.

| Option | H1 (SEO) | Tagline | Supporting line | Tone |
|---|---|---|---|---|
| **A. Direct** | Rashmin Sharma, software developer in Nepal | Built on a desk. Aimed at a company. | I build web and mobile products, experiment with hardware and AI, and I am working toward founding my own product company. | Confident, founder-forward |
| **B. Workshop** | Rashmin Sharma, software developer in Nepal | Welcome to my workshop. | Everything on this desk is a project, an experiment or a plan. Click around. | Friendly, inviting |
| **C. Proof-first** | Rashmin Sharma, software developer in Nepal | I build things that run. | Software, small hardware and AI experiments from Kathmandu. Start with what I've shipped. | Understated, evidence-led |
| **D. Ambition** | Rashmin Sharma, software developer in Nepal | Building toward something bigger. | A developer's workshop, a company in progress, and a roadmap I publish openly. | Ambitious, bolder |

**Recommendation:** Option A or C. Both make a concrete claim without overstating. Final line **[verify]**: confirm what you have actually shipped and the status of the company before choosing wording that implies a specific achievement.

| Metadata | Draft |
|---|---|
| Title tag (60 characters or fewer) | `Rashmin Sharma | Software Developer & Builder, Nepal` |
| Meta description (155 characters or fewer) | `Rashmin Sharma is a software developer in Nepal building web and mobile products, hardware and AI experiments, and a path toward founding a product company.` |
| Primary CTAs | **Enter the Workshop** and **See what I've shipped** (plus a visible **Classic view** link) |

---

## 8. Microcopy

| Element | Copy |
|---|---|
| Loading | `Warming up the workshop...` |
| Fast lane | `Skip to classic view` |
| Back control | `Back to desk` |
| Hotspot labels | Laptop: *Shipped*; Pi: *The Lab*; Whiteboard: *Roadmap*; Notebook: *Notes*; Phone: *Say hello*; Nameplate: *Ventures*; Bookshelf: *How I think* |
| Explorer counter | `4 of 10 lit` |
| Completion | `All ten lit. Try typing "hire" in the terminal.` |
| Reduced motion or no WebGL | `Showing the classic view for a faster experience. You can open the Workshop any time.` |

---

## 9. Asset brief (for the modeller)

### 9.1 Global specifications

| Item | Requirement |
|---|---|
| Format | glTF binary (`.glb`), Draco or Meshopt compressed |
| Units and scale | 1 unit = 1 metre, real-world proportions, Y up |
| Style | Low-poly, rounded edges, flat colours from the palette, baked ambient occlusion and soft lighting |
| Textures | Shared atlas, 2048 px maximum, no unique per-object 4K maps |
| Naming | `obj_laptop`, `obj_pi`, `obj_whiteboard`, and so on; hotspot empties named `hs_laptop`, `hs_pi`, and so on |
| Pivots | At the base for placement; separate nodes for moving parts (propeller blades, notebook cover, LED caps) |
| Delivery | `.blend` source plus `.glb` exports, a contact sheet render, and a short README of what each node is |
| Licensing | All models original or from sources with clear commercial licences. No copied third-party artwork. No Raspberry Pi logo on the board unless permitted by brand guidelines |

### 9.2 Per-object brief

| Object | Reference | Geometry notes | Materials and colour | Animation | Triangles | Needed from Rashmin |
|---|---|---|---|---|---|---|
| **Laptop** | Banner (laptop with block-code screen) | Rounded lid and base, thin bezel, screen as a separate mesh | Light grey-lavender body, `screen` navy display | Lid angle fixed; screen texture swaps per module | 8k to 12k | Your laptop's real silhouette and the screen content to show |
| **Raspberry Pi** | Banner (green board, stacked ports, cable) | Board 85 x 56 mm if Pi 3 or 4 form factor; ports, chip, header and a few GPIO pins modelled; no logo | `board` green, white ports, dark chip | 2 to 4 LEDs that blink or toggle | 8k to 15k | **Your Pi model** and photos from top, side and port edge |
| **LED set** | Banner (5 yellow, 5 red) | Small domed LEDs with two legs, sitting in a tray | `signal` yellow and a red, translucent caps | Emissive on and off per module | 500 each | Types of LEDs you actually use, if different |
| **Drone propellers** | Banner (yellow three-blade props) | Three-blade, hub with a centre hole, wall mount | `signal` yellow | Spin on hover, speed driven by the servo value | 1.5k each | Confirm the drone work is yours, or choose a different hardware prop |
| **Coffee mug and coaster** | Banner | Mug with handle and a slightly dished coaster | Warm brown drink, white mug, tan coaster | Steam sprite loop | 2k to 4k | Optional: a photo of your real mug |
| **Cable** | Banner | Smooth tube spline from the Pi to the laptop | White | Emissive pulse travelling along it | 1k | None |
| **Whiteboard** | New | Frame, thin marker tray, readable face | White board, `ink` frame | Content swaps between Now, Next and Later | 2k | Your roadmap items |
| **Notebook** | New | Hardcover, page stack, a ribbon | `cobalt` cover, cream pages | Cover opens, pages flip | 4k to 6k | Cover design preference |
| **Phone** | New | Slim device on a small stand | Dark body, screen texture | Screen wake on approach | 3k | None |
| **Nameplate** | New | Desk plate with an engraved name or company mark | Brushed metal or wood, `ink` text | Subtle slide-out | 1k | Company name and approved wording **[verify]** |
| **Bookshelf and books** | New | Open shelf with 6 to 8 books in distinct colours | Palette colours, one `signal` spine | Book pulls out slightly on hover | 4k to 6k | The principles or technologies you want on spines |
| **Room shell and window** | New | Desk, wall, floor, window frame, skyline silhouette outside | Palette colours; sky gradient is the only gradient | Day to night lighting swap | 6k to 10k | None |
| **Wall badge** | New | Small round or shield badge | One colour | None | 300 | One-line community note |

### 9.3 Source photo checklist

For each real object (Pi, laptop, LEDs, notebook, mug): front, side and top photos on a plain surface in natural light, plus one wide photo of your real desk.

---

## 10. Open items to close Phase 2

| # | Item | Needed from | Blocks |
|---|---|---|---|
| 1 | Origin and licence of the reference illustration | Rashmin | Whether it is reference only or can be adapted |
| 2 | Exact Raspberry Pi model | Rashmin | Pi model dimensions and ports |
| 3 | Company name, role and stage | Rashmin | Ventures module and nameplate, hero line |
| 4 | Top two or three projects, screenshots or demos | Rashmin | Laptop module and case studies |
| 5 | Hero option (A, B, C, D or a mix) | Rashmin | Hero and metadata |
| 6 | Day-first or night-first default | Rashmin | Initial scene lighting |
| 7 | Who models the assets (you, a freelancer, staged) | Rashmin | Phase 4 timeline |
| 8 | Willingness to show live data (commits, Pi sensors) | Rashmin | Proof strip and Pi demo |
| 9 | Photos of you, natural light | Rashmin | Hero and About |

**Next step after approval:** Phase 1 repository audit (in parallel if the repository is available), then Phase 3 classic site and SEO foundation, followed by the three-object prototype for a go or no-go review.
