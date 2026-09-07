#!/usr/bin/env bash
set -euo pipefail
smoke_temp="$(mktemp -d)"
export RUNNER_TEMP="$smoke_temp"
python3 -m http.server 4321 --bind 127.0.0.1 --directory dist &
server=$!
trap 'kill "${server}" 2>/dev/null || true; rm -rf "$smoke_temp"' EXIT
timeout 90 bash -c 'until curl -fsS -o /dev/null http://127.0.0.1:4321/; do sleep 1; done'
for path in / /google-drev/ /meebook/; do
  echo "==> ${path}"
  curl -fsS -m 10 -o "${RUNNER_TEMP}/page.html" "http://127.0.0.1:4321${path}"
  grep -q '<title>' "${RUNNER_TEMP}/page.html" \
    || { echo "SMOKE FAILED: ${path} served no <title>"; exit 1; }
done
