# Development CI

Every PR, default-branch push and manual `ci.yml` dispatch runs the same checks.
The required `ci / required` aggregate rejects failed, cancelled, missing and
skipped prerequisites. Workflow validation is read-only and rejects tracked-file
mutations. Shared guards, gate and Biome repair use versioned releases of
`edbfi/automation`; all external action references use full version tags.

The quality lane runs complementary prek hygiene and stack guards, read-only
Biome, actual type checks, applicable unit tests, a static build and applicable
bundle budget. It uploads one `site-dist` artifact. HTTP smoke and browser lanes
consume those exact bytes, so they neither rebuild nor accidentally test a dev
server. Frozen installs use packageManager's Bun version and a lockfile-keyed cache.
Only `ci.yml` has development triggers; the other check workflows are callable lanes.

Astro content validation is joined by svelte-check for the two existing islands. HTTP smoke covers the three established documentation routes. No browser suite exists yet; interactive island behavior is a documented coverage gap.

Reproduce locally: `bun install --frozen-lockfile`, then
`SKIP=no-commit-to-branch,biome,build prek run --all-files --hook-stage manual`,
`bash .github/scripts/check.sh`, and `bash .github/scripts/smoke.sh`.
Where a browser suite exists, install its Playwright browsers and run
`CI=true bun run test:e2e` after the build. Keep port 4321 free for these checks.
Prek's Biome and build hooks are skipped only because explicit CI steps cover them;
the default-branch hook applies to local commits. No existing stack guards are removed.

The shared Renovate preset includes the official Biome schema manager and isolates
Biome/TypeScript/prek groups. Biome repair computes changes without write permission,
then a separate publisher validates the allowed paths and live PR head before
committing and dispatching full CI on the new SHA. Existing template formatting
exclusions remain in force. TypeScript updates exercise both Astro and Svelte
checks without a separate version cap. Incompatible updates remain unmerged.

Renovate updates, including majors and shared-policy versions, merge unattended
only after every current-head job in `.github/merge-policy.json` passes. The
checked action verifies genuine author sign-offs and dispatches full final CI
for the exact merged commit. No dashboard approval, branch protections or
rulesets are required. Other changes retain the maintainer ghmerge review.

Successful final CI dispatches the existing Pages publisher for that exact main
commit. It requires successful current final push or dispatched CI and rechecks
the default revision before publication. Manual dispatch remains available.

Svelte-check uses `tsconfig.svelte.json` to include generated Astro declarations
and application TypeScript/Svelte sources. Astro-check owns the framework/config
surface. This avoids type-checking Starlight's internal source dependency graph
while preserving Svelte island diagnostics. The existing StepChecklist initial-
prop warning is visible; changing its state-reset semantics is outside this CI change.
