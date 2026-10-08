# EDB Pede — guides

Hurtige guides til lærere på Strandgårdskolen og i Ishøj Kommune: login, koder,
Chromebook, Google Drev, Skoletube, Meebook og nyttige links.

Bygget med [Astro](https://astro.build) + [Starlight](https://starlight.astro.build),
[Bun](https://bun.sh), [UnoCSS](https://unocss.dev), Svelte 5 og SolidJS.

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
med en varm signaturfarve. Kodningsretningslinjer findes i
`.agents/rules/astro-dev-pro.md`.
