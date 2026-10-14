#!/usr/bin/env bash
# Phase 1 repo snapshot for the portfolio rebuild.
# Read-only. Prints env var NAMES only (never values). Output: audit/snapshot.txt
# Usage: bash audit.sh           (fast, no build)
#        bash audit.sh --build   (also runs lint, build and a dependency audit)

OUT="audit/snapshot.txt"
mkdir -p audit
: > "$OUT"

sec()  { printf '\n## %s\n' "$1" >> "$OUT"; }
cap()  { cut -c1-200; }
files() {
  find . \( -path ./node_modules -o -path ./.git -o -path ./.next -o -path ./audit \
         -o -path ./out -o -path ./dist -o -path ./.vercel \) -prune -o -type f -print
}
g() {
  grep -rnIE "$1" . \
    --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next \
    --exclude-dir=audit --exclude-dir=out --exclude-dir=dist \
    --exclude=package-lock.json --exclude=pnpm-lock.yaml --exclude=yarn.lock \
    --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' \
    --include='*.mjs' --include='*.css' --include='*.scss' --include='*.html' \
    --include='*.md' --include='*.mdx' --include='*.json' 2>/dev/null
}

sec "META"
{
  echo "date: $(date -u +%Y-%m-%dT%H:%MZ)"
  echo "node: $(node -v 2>/dev/null || echo none) | npm: $(npm -v 2>/dev/null || echo none)"
  echo "lockfiles: $(ls package-lock.json pnpm-lock.yaml yarn.lock bun.lockb bun.lock 2>/dev/null | tr '\n' ' ')"
} >> "$OUT"

sec "GIT"
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  {
    echo "branch: $(git rev-parse --abbrev-ref HEAD)"
    echo "commits: $(git rev-list --count HEAD 2>/dev/null)"
    echo "uncommitted files: $(git status --porcelain | wc -l | tr -d ' ')"
    echo "remotes:"; git remote -v | sed -E 's#(//)[^/@]+@#\1#' | head -4
    echo "last 12 commits:"; git log --oneline -n 12
  } >> "$OUT"
else
  echo "not a git repo" >> "$OUT"
fi

sec "PACKAGE.JSON"
if [ -f package.json ] && command -v node >/dev/null 2>&1; then
  node -e '
    const p=require("./package.json");
    const o=(k,v)=>console.log(k+": "+Object.entries(v||{}).map(([a,b])=>a+"@"+b).join(", "));
    console.log("name:",p.name,"| version:",p.version);
    console.log("scripts:",JSON.stringify(p.scripts));
    o("deps",p.dependencies); o("devDeps",p.devDependencies);
  ' 2>&1 | cap >> "$OUT"
else
  echo "no package.json (or node missing)" >> "$OUT"
fi

sec "STRUCTURE (dirs, depth 2)"
find . -maxdepth 2 \( -path ./node_modules -o -path ./.git -o -path ./.next -o -path ./audit \) -prune -o -type d -print | sort | head -60 >> "$OUT"

sec "ROUTING"
for d in app src/app pages src/pages; do [ -d "$d" ] && echo "router dir: $d" >> "$OUT"; done
files | grep -E '^\./(src/)?(app|pages)/' | sort | head -80 >> "$OUT"

sec "COMPONENTS / LIB (file counts)"
for d in components src/components lib src/lib hooks src/hooks data src/data content; do
  [ -d "$d" ] && echo "$d: $(find "$d" -type f | wc -l | tr -d ' ') files" >> "$OUT"
done

sec "STYLING"
{
  ls tailwind.config.* postcss.config.* 2>/dev/null
  echo "css modules: $(files | grep -c '\.module\.')"
  echo "largest stylesheets (lines):"
  files | grep -E '\.(css|scss)$' | xargs wc -l 2>/dev/null | sort -rn | head -8
} >> "$OUT"

sec "FONTS"
g 'next/font|fonts\.googleapis|@font-face' | cap | head -10 >> "$OUT"

sec "SEO / METADATA"
{
  files | grep -iE 'sitemap|robots|opengraph-image|twitter-image|manifest|favicon|\.ico$' | head -12
  echo "--- metadata usage:"
  g 'generateMetadata|export const metadata|application/ld\+json|openGraph|canonical|<title' | cap | head -25
} >> "$OUT"

sec "ASSETS (public/)"
if [ -d public ]; then
  {
    echo "size: $(du -sh public | cut -f1)"
    echo "types:"; find public -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -8
    echo "files over 300 KB:"; find public -type f -size +300k -exec ls -lh {} \; | awk '{print $5, $9}' | head -15
  } >> "$OUT"
else
  echo "no public/ dir" >> "$OUT"
fi

sec "ENV (names only)"
for f in .env .env.*; do
  [ -e "$f" ] || continue
  echo "$f:" >> "$OUT"
  grep -E '^[A-Za-z_][A-Za-z0-9_]*=' "$f" | sed 's/=.*//' | sed 's/^/  /' >> "$OUT"
done
if git rev-parse --is-inside-work-tree >/dev/null 2>&1 && [ -e .env ]; then
  git check-ignore -q .env && echo ".env is gitignored" >> "$OUT" || echo "WARNING: .env is NOT gitignored" >> "$OUT"
fi

sec "DEPLOYMENT"
{
  for f in vercel.json netlify.toml firebase.json Dockerfile docker-compose.yml wrangler.toml render.yaml fly.toml amplify.yml; do
    [ -e "$f" ] && echo "found: $f"
  done
  [ -d .vercel ] && echo "found: .vercel/ (linked Vercel project)"
  [ -d .github/workflows ] && { echo "workflows:"; ls .github/workflows; grep -hE '^name:|uses:|run: .*(build|deploy)' .github/workflows/* 2>/dev/null | cap | head -25; }
  for f in next.config.js next.config.mjs next.config.ts vercel.json; do
    [ -f "$f" ] && { echo "--- $f"; head -50 "$f" | cap; }
  done
  echo "--- domain mentions:"
  g 'rashmin\.com\.np|vercel\.app|netlify\.app|github\.io' | cap | head -10
} >> "$OUT"

sec "CONTENT DEBT (placeholders, TODOs)"
g 'lorem|placeholder|TODO|FIXME|your name|example\.com|John Doe|Project [0-9]|Sample ' | cap | head -40 >> "$OUT"

sec "EXTERNAL LINKS (unique, check for malformed ones)"
grep -rhoIE "(https?://|mailto:)[^\"' )<>\`]+" . \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next --exclude-dir=audit \
  --exclude=package-lock.json --exclude=pnpm-lock.yaml --exclude=yarn.lock 2>/dev/null \
  | sort | uniq -c | sort -rn | head -60 | cap >> "$OUT"

if [ "$1" = "--build" ]; then
  sec "LINT (tail)";  npm run lint --if-present 2>&1 | tail -25 | cap >> "$OUT"
  sec "BUILD (tail)"; npm run build 2>&1 | tail -40 | cap >> "$OUT"
  sec "NPM AUDIT (prod, tail)"; npm audit --omit=dev 2>&1 | tail -12 | cap >> "$OUT"
fi

echo "Done: $OUT ($(wc -l < "$OUT") lines). Skim it for anything private before sharing."
