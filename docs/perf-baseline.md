# Performance Baseline

Captured during Task P4a using `npm run build --turbopack`.

## First Load JS

| Route    | Baseline (pre-P4a) | After P4a |
|----------|--------------------|-----------|
| `/`      | 5.3 kB / 124 kB    | 5.3 kB / 124 kB |
| `/about` | 0 B / 118 kB       | 0 B / 118 kB |

`three` and `@react-three/fiber` are loaded only by `/workshop` via `next/dynamic` with `ssr: false`.  
Homepage and About are unchanged. ✅

## After P4b (full scene)

| Route      | Size     | First Load JS |
|------------|----------|---------------|
| `/`        | 5.3 kB   | 124 kB ✅     |
| `/about`   | 0 B      | 118 kB ✅     |
| `/workshop`| 2.45 kB  | 121 kB        |

Three.js + R3F payload lazy-loaded into `/workshop` only. Homepage unchanged.

## Perf overlay (?perf=1)

not measured (dev server was running stale; build passes clean, overlay renders in-browser)

