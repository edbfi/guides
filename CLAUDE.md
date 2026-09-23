# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Static Astro 7 + Starlight site of Danish IT guides for teachers, published to https://guides.edb.fi
(GitHub Pages). Bun runs everything. There is no SSR adapter, no Astro Actions, and no JS test runner.

## Commands

- `bun install --frozen-lockfile`, then `bun run dev` (http://localhost:4321)
- `bun run check`: `astro check`, then `svelte-check` twice (TypeScript 6, then native `--tsgo`) against
  `tsconfig.svelte.json`. All three must pass. The prek pre-push hook runs this too.
- `bun run lint` / `bun run lint:fix`: Biome. CI runs the read-only `bunx --bun biome ci .`.
- `bun run build`: static output in `dist/`
- Tests are Python and cover only `.github/scripts/deployment.py` (the deploy gate), not the site:
  - all: `python3 -B -m unittest discover -s tests -p 'test_*.py'`
  - one case: `python3 -B -m unittest discover -s tests -p test_deployment.py -k test_current_successful_default_ci`
- Reproduce CI: `bash .github/scripts/check.sh` (biome ci, unittest, check, build), then
  `bash .github/scripts/smoke.sh`. It serves `dist/` on port 4321, so keep that port free, and checks
  that `/`, `/google-drev/` and `/meebook/` return a `<title>`.
- CI fails if the run changes any tracked file (`git diff --exit-code HEAD`). Run `bun run lint:fix`
  and commit what it changes.

## Adding a guide

`README.md` ("Sådan tilføjer du en ny guide") has the page template: frontmatter, the `Aside` note,
`<Steps>`, `## Hvis det ikke virker` with `<details class="edb-trouble">`, and `## Relaterede guides`.
Copy an existing guide such as `src/content/docs/google-drev/hvordan-deler-jeg-dokumenter.mdx`. The
README leaves out this wiring:

1. Create `src/content/docs/<kategori>/<slug>.mdx`. The file path becomes the URL. Slugs are ASCII
   transliterations of the Danish title (å→a, ø→o, æ→ae), e.g. `sadan-skifter-du-kode-pa-uni-login`.
2. Add a `<LinkCard>` for it to the category's `index.mdx`. The sidebar is generated automatically,
   but the category overview pages are written by hand.
3. If it covers a common situation, add an entry to the `situations` array in
   `src/components/SituationCards.astro` (the landing page).
4. Put screenshots in `public/screens/` and reference them by absolute path (`/screens/x.png`).
   prek's `check-added-large-files` rejects any added file over 500 KB, so compress before adding.
5. For a new category, add a sidebar group with `autogenerate: { directory: "<kategori>" }` in
   `astro.config.mjs`, and create an `index.mdx` with `sidebar: { label: Oversigt, order: 0 }`.

When you rename or move a guide, the old URL stops working. Add an old→new entry to the `redirects`
map in `astro.config.mjs` (`gitbookRedirects`). Then grep `src/` for the old path: `SituationCards`,
the `LinkCard`s, inline links, and existing redirect targets all hard-code URLs.

## Images in MDX

| Need | Use |
| --- | --- |
| Full screenshot (theme.css adds a frame) | `![alt](/screens/x.png)`, optionally inside `<figure>` |
| Button or icon shown mid-sentence | `<img src="/screens/x.png" class="edb-inline" alt="…" />` |
| Tall phone screenshot | `<img src="…" class="edb-phone-shot" alt="…" width=… height=… />` |

## Components and islands

- MDX imports use relative paths because no alias is configured: `../../../components/...` from a
  category guide, and one more `../` from nested folders (`skoletube/`, `wevideo/`).
- Svelte 5 islands (runes only) live in `src/components/islands/`. An island without a `client:*`
  directive renders as static HTML and silently ignores clicks. This repo uses `client:visible`,
  and props must be serializable. Example from
  `src/content/docs/login-koder-og-sikker-adgang/fa-os2faktor-til-din-chromebook.mdx`:

  ```mdx
  <StepChecklist
    client:visible
    title="Tjekliste – har du husket det hele?"
    steps={[
      "OS2faktor-udvidelsen er sat fast i Chrome",
  ```

- Island styles: new islands use a scoped `<style>` block with BEM classes, like `kh__*` in
  `Kodeordshjaelper.svelte`. StepChecklist's `sc__*` rules sit in `src/styles/theme.css` because the
  component was ported from Solid, so don't copy that. UnoCSS utility classes appear only in
  `.astro` files.
- A Starlight override in `src/components/overrides/` takes effect only after you register it under
  `components` in `astro.config.mjs`. Wrap the default
  (`import Default from "@astrojs/starlight/components/<Name>.astro"`) rather than replacing it.
- Theme tokens (`--sl-color-*` overrides and `--edb-*`) live in `src/styles/theme.css`.
  `uno.config.ts` mirrors `--edb-brand` and `--edb-warm`, so a renamed token must be changed in both
  files.

## Git hooks

- `prek.toml` enforces Conventional Commits in a commit-msg hook. Once hooks are installed
  (`prek install`), `no-commit-to-branch` blocks commits on `main`, so commit on a branch instead.

## Reference docs

- `.agents/rules/astro-svelte5-islands.md`: a generic Bun/Astro 7/Svelte 5 reference (630 lines).
  Read its "Svelte 5 islands" and "Anti-patterns to avoid" sections before writing Svelte. Most of
  the rest does not apply here: this repo has no shadcn-svelte, Vitest, Playwright, `bun test`,
  Actions, sessions or adapter, and its scripts call `astro …` rather than `bun --bun astro …`. Where
  the two disagree, follow `package.json`.
- `CI.md`: CI lanes, Renovate automerge and the gated Pages deploy. Read it before editing
  `.github/`, `renovate.json` or `prek.toml`.
- `README.md` still mentions SolidJS and `.agents/rules/astro-dev-pro.md`. Solid was removed, and
  the file doesn't exist; the rules file above replaces it.
