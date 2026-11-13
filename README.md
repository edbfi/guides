<p align="center">
  <img src="src/assets/brand/edbpede.svg" alt="guides logo" width="160" height="161">
</p>

<h1 align="center">guides</h1>

<p align="center"><strong>Hurtige IT-guides til lærere på Strandgårdskolen og i Ishøj Kommune.</strong></p>

<p align="center">
  <a href="https://github.com/edbfi/guides/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-AGPL--3.0--or--later-blue?style=flat" alt="License: AGPL-3.0-or-later"></a>
  <a href="https://github.com/oven-sh/bun"><img src="https://img.shields.io/badge/Bun-000000?style=flat&amp;logo=bun&amp;logoColor=white" alt="Bun"></a>
  <a href="https://github.com/withastro/astro"><img src="https://img.shields.io/badge/Astro-BC52EE?style=flat&amp;logo=astro&amp;logoColor=white" alt="Astro"></a>
  <a href="https://github.com/withastro/starlight"><img src="https://img.shields.io/badge/Starlight-5F4DEE?style=flat" alt="Starlight"></a>
  <a href="https://github.com/microsoft/TypeScript"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&amp;logo=typescript&amp;logoColor=white" alt="TypeScript"></a>
  <a href="https://github.com/edbfi/guides/actions/workflows/ci.yml?query=branch%3Amain"><img src="https://img.shields.io/github/actions/workflow/status/edbfi/guides/ci.yml?branch=main&amp;event=push&amp;label=CI&amp;style=flat" alt="CI"></a>
</p>

Hurtige guides til lærere på Strandgårdskolen og i Ishøj Kommune: login, koder,
Chromebook, Google Drev, Skoletube, Meebook og nyttige links.

Bygget med [Astro](https://astro.build) + [Starlight](https://starlight.astro.build),
[Bun](https://bun.sh), [UnoCSS](https://unocss.dev) og Svelte 5.

## Kom i gang

```bash
bun install      # installér afhængigheder
bun run dev      # start udviklingsserver på http://localhost:4321
bun run check    # Astro/TypeScript-diagnostik
bun run build    # byg til dist/
bun run smoke    # røgtest af dist/ (efter build)
bun run preview  # forhåndsvis det byggede site
```

## Sådan tilføjer du en ny guide

1. Læg en `.mdx`-fil i den rette mappe under `src/content/docs/<kategori>/`.
   Filnavnet bliver URL'en.
2. Tilføj frontmatter med `title`, `description` og `sidebar.order`.
3. Følg den fælles skabelon, de øvrige guides bruger:
   - en kort indledning,
   - en `<Aside type="note">` med "Hvornår skal du bruge denne guide?",
   - `<Steps>` med trin og billeder,
   - et `## Hvis det ikke virker`-afsnit med `<details class="edb-trouble">`,
   - `## Relaterede guides` med `<LinkCard>`.

Nye kategorier tilføjes i `sidebar`-listen i `astro.config.mjs`. Sidebaren under
hver kategori genereres automatisk fra mappens indhold.

## Projektstruktur

```
src/
  content/docs/        Alle guides (MDX), én mappe per kategori
  components/          Astro-komponenter (SituationCards, Embed)
    islands/           Svelte- og Solid-øer (Kodeordshjælper, StepChecklist)
    overrides/         Starlight-komponentoverrides (Footer)
  styles/theme.css     Design tokens (lyst/mørkt tema) + komponentstil
  assets/brand/        Logo
public/screens/        Skærmbilleder til guides
```

Designet er bygget på tweakcn-temaet "Modern Minimal" som farvegrundlag, udvidet
med en varm signaturfarve.

## Licens

Projektets originale kode udgives under GNU Affero General Public License,
enten version 3 eller (efter eget valg) enhver senere version
(`AGPL-3.0-or-later`). Se [LICENSE](LICENSE) for den fulde licenstekst.

Eksisterende licensvilkår og ophavsretlige meddelelser for tredjepartskode,
afhængigheder og grafik bevares, herunder MIT-licensen for
PhrozenByte/gh-workflow-immortality-scriptet, som keepalive-workflowet henter.
