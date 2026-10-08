#!/usr/bin/env bash
# Smoke test of the production build: serve dist/ statically, the way GitHub Pages does,
# and request the main routes, one GitBook redirect and the Pagefind bundle.
# Run after `bun run build`.
set -euo pipefail
port="${PORT:-$(python3 -c 'import socket; s = socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1])')}"
base="http://127.0.0.1:${port}"
work="$(mktemp -d)"
server=''
trap 'if [[ -n "$server" ]]; then kill "$server" 2>/dev/null || true; wait "$server" 2>/dev/null || true; fi; rm -rf "$work"' EXIT

[[ -f dist/index.html ]] || { echo "SMOKE FAILED: dist/index.html missing; run bun run build first"; exit 1; }
python3 -u -m http.server "$port" --bind 127.0.0.1 --directory dist >"$work/server.log" 2>&1 &
server=$!
# Ready only once this server has bound the port and answers: if it exits (e.g. the port is
# taken), fail instead of testing whatever else listens there.
for _ in $(seq 150); do
  kill -0 "$server" 2>/dev/null || { echo "SMOKE FAILED: server exited"; cat "$work/server.log"; exit 1; }
  grep -q '^Serving HTTP on' "$work/server.log" && curl --noproxy '*' -fs -o /dev/null "$base/" && break
  sleep 0.2
done
kill -0 "$server" 2>/dev/null && grep -q '^Serving HTTP on' "$work/server.log" \
  || { echo "SMOKE FAILED: server did not start on $base"; cat "$work/server.log"; exit 1; }

fetch() { curl --noproxy '*' -fsS -m 10 -o "$work/page" "$base$1" || { echo "SMOKE FAILED: $1 did not return 200"; exit 1; }; }

for path in / /google-drev/ /meebook/; do
  fetch "$path"
  title="$(grep -o '<title>[^<]*' "$work/page" | head -1 | cut -c8-)"
  [[ -n "$title" ]] || { echo "SMOKE FAILED: $path served no <title>"; exit 1; }
  # http.server lists a directory without index.html with a 200 and a title; Pages would 404.
  [[ -f "dist${path}index.html" && "$title" != "Directory listing"* ]] \
    || { echo "SMOKE FAILED: $path has no index.html (served: $title)"; exit 1; }
  echo "ok $path: $title"
done

# Old GitBook URL -> Starlight path (astro.config.mjs `gitbookRedirects`)
fetch /google-drev/oversigt/
grep -q 'http-equiv="refresh" content="0;url=/google-drev/"' "$work/page" \
  || { echo "SMOKE FAILED: /google-drev/oversigt/ does not redirect to /google-drev/"; exit 1; }
echo "ok /google-drev/oversigt/: redirects to /google-drev/"

fetch /pagefind/pagefind.js
[[ -s "$work/page" ]] || { echo "SMOKE FAILED: /pagefind/pagefind.js is empty"; exit 1; }
echo "ok /pagefind/pagefind.js: $(wc -c <"$work/page") bytes"
