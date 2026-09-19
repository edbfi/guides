#!/usr/bin/env bash
set -euo pipefail
smoke_temp="$(mktemp -d)"
export RUNNER_TEMP="$smoke_temp"
server=''
trap 'if [[ -n "$server" ]]; then kill "$server" 2>/dev/null || true; fi; rm -rf "$smoke_temp"' EXIT
# CI delegates readiness, deadlines and process cleanup to the shared smoke action.
# Keep the standalone entry point useful after a local production build.
if [[ "${1:-}" != '--assert-only' ]]; then
  python3 -m http.server 4321 --bind 127.0.0.1 --directory dist &
  server=$!
  timeout 90 bash -c 'until curl --noproxy "*" -fsS -o /dev/null http://127.0.0.1:4321/; do sleep 1; done'
fi

for path in / /google-drev/ /meebook/; do
  echo "==> ${path}"
  curl --noproxy "*" -fsS -m 10 -o "${RUNNER_TEMP}/page.html" "http://127.0.0.1:4321${path}"
  grep -q '<title>' "${RUNNER_TEMP}/page.html" \
    || { echo "SMOKE FAILED: ${path} served no <title>"; exit 1; }
done
