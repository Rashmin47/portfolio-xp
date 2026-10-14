# Performance Baseline

Captured during Task P4a using `npm run build --turbopack`.

## First Load JS

| Route    | Baseline (pre-P4a) | After P4a |
|----------|--------------------|-----------|
| `/`      | 5.3 kB / 124 kB    | 5.3 kB / 124 kB |
| `/about` | 0 B / 118 kB       | 0 B / 118 kB |

`three` and `@react-three/fiber` are loaded only by `/workshop` via `next/dynamic` with `ssr: false`.  
Homepage and About are unchanged. ✅

## /workshop

| Route      | Size     | First Load JS |
|------------|----------|---------------|
| `/workshop`| 2.1 kB   | 120 kB        |

Three.js bundle is excluded from the First Load JS shared chunk and only downloaded when the user navigates to `/workshop` and capability check passes.
