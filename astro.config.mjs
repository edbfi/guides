// @ts-check

import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";
import UnoCSS from "@unocss/astro";
import { defineConfig } from "astro/config";

// Old GitBook URLs -> new Starlight paths. Keeps published links alive.
// Mirrors the `redirects` block from the former .gitbook.yaml.
const gitbookRedirects = {
  "/loginproblemer/den-bedste-made-at-logge-ind-pa":
    "/login-koder-og-sikker-adgang/den-bedste-made-at-logge-ind-pa/",
  "/skift-af-koder/sadan-skifter-du-kode-pa-uni-login":
    "/login-koder-og-sikker-adgang/sadan-skifter-du-kode-pa-uni-login/",
  "/skift-af-koder/sadan-skifter-du-kode-pa-meddel.dk-til-chromebooks":
    "/login-koder-og-sikker-adgang/sadan-skifter-du-kode-pa-meddel-dk-til-chromebooks/",
  "/skift-af-koder/sadan-skifter-du-din-egen-kode-pa-din-chromebook":
    "/login-koder-og-sikker-adgang/sadan-skifter-du-din-egen-kode-pa-din-chromebook/",
  "/os2faktor/fa-os2faktor-til-din-chromebook":
    "/login-koder-og-sikker-adgang/fa-os2faktor-til-din-chromebook/",
  "/os2faktor/hvordan-bruger-jeg-os2faktor":
    "/login-koder-og-sikker-adgang/hvordan-bruger-jeg-os2faktor/",
  "/os2faktor/hvordan-fjerner-jeg-gamle-enheder-fra-os2faktor":
    "/login-koder-og-sikker-adgang/hvordan-fjerner-jeg-gamle-enheder-fra-os2faktor/",
  "/nye-medarbjedere/hvordan-kommer-jeg-pa-ind-min-chromebook":
    "/chromebook-og-forste-dag/hvordan-kommer-jeg-ind-pa-min-chromebook/",
  "/andet/chromebook-tricks": "/chromebook-og-forste-dag/",
  "/andet/chromebook-tricks/hvordan-slar-jeg-touch-funktionen-fra":
    "/chromebook-og-forste-dag/hvordan-slar-jeg-touch-funktionen-fra/",
  "/google-drev/oversigt": "/google-drev/",
  "/google-drev/oversigt/generelt": "/google-drev/",
  "/google-drev/oversigt/generelt/hvordan-deler-jeg-dokumenter":
    "/google-drev/hvordan-deler-jeg-dokumenter/",
  "/meebook/kopiere-meddelsesbog-til-nyt-skolear":
    "/meebook/kopiere-meddelelsesbog-til-nyt-skolear/",
  "/skoletube/oversigt": "/video-medier-og-laeremidler/",
  "/skoletube/oversigt/skoletube": "/video-medier-og-laeremidler/",
  "/skoletube/oversigt/skoletube/opret-en-kanal":
    "/video-medier-og-laeremidler/skoletube/opret-en-kanal/",
  "/skoletube/oversigt/skoletube/indstillinger-for-din-kanal":
    "/video-medier-og-laeremidler/skoletube/indstillinger-for-din-kanal/",
  "/skoletube/oversigt/skoletube/hvordan-finder-jeg-min-kanal":
    "/video-medier-og-laeremidler/skoletube/hvordan-finder-jeg-min-kanal/",
  "/skoletube/oversigt/skoletube/inviter-andre-til-din-kanal":
    "/video-medier-og-laeremidler/skoletube/inviter-andre-til-din-kanal/",
  "/skoletube/oversigt/wevideo": "/video-medier-og-laeremidler/",
  "/skoletube/oversigt/wevideo/sadan-gemmer-du-din-video":
    "/video-medier-og-laeremidler/wevideo/sadan-gemmer-du-din-video/",
  "/andet/sadan-kan-du-stadig-se-youtube":
    "/video-medier-og-laeremidler/sadan-kan-du-stadig-se-youtube/",
  "/andet/sadan-logger-du-pa-den-nye-ereolengo":
    "/video-medier-og-laeremidler/sadan-logger-du-pa-den-nye-ereolengo/",
  "/gode-links/oversigt-over-links": "/links-og-genveje/",
};

// https://astro.build/config
export default defineConfig({
  site: "https://guides.edb.fi",
  redirects: gitbookRedirects,
  integrations: [
    UnoCSS({ injectReset: false }),
    svelte(),
    starlight({
      title: "EDB Pede",
      favicon: "/favicon.svg",
      description:
        "Hurtige guides til lærere på Strandgårdskolen og i Ishøj Kommune: login, koder, Chromebook, Google Drev, Skoletube, Meebook og nyttige links.",
      defaultLocale: "root",
      locales: {
        root: { label: "Dansk", lang: "da" },
      },
      logo: {
        src: "./src/assets/brand/edbpede.svg",
        alt: "EDB Pede",
        replacesTitle: false,
      },
      customCss: [
        "@fontsource-variable/inter/index.css",
        "@fontsource-variable/jetbrains-mono/index.css",
        "./src/styles/theme.css",
      ],
      components: {
        Footer: "./src/components/overrides/Footer.astro",
        PageFrame: "./src/components/overrides/PageFrame.astro",
      },
      // Re-apply the saved sidebar-collapsed choice before first paint so the
      // layout never flashes open then shut. The toggle itself lives in the
      // PageFrame override above.
      head: [
        {
          tag: "script",
          content:
            "try{if(localStorage.getItem('edb-sidebar-collapsed')==='1')document.documentElement.setAttribute('data-edb-sidebar-collapsed','')}catch(e){}",
        },
      ],
      social: [
        {
          icon: "external",
          label: "yt.edb.fi",
          href: "https://yt.edb.fi",
        },
      ],
      // Groups start collapsed so the sidebar stays a short, calm list of
      // topics instead of a long wall of every guide at once.
      sidebar: [
        {
          label: "Start her",
          link: "/",
        },
        {
          label: "Login, koder og sikker adgang",
          collapsed: true,
          items: [{ autogenerate: { directory: "login-koder-og-sikker-adgang" } }],
        },
        {
          label: "Chromebook og første dag",
          collapsed: true,
          items: [{ autogenerate: { directory: "chromebook-og-forste-dag" } }],
        },
        {
          label: "Google Drev og deling",
          collapsed: true,
          items: [{ autogenerate: { directory: "google-drev" } }],
        },
        {
          label: "Video, medier og læremidler",
          collapsed: true,
          items: [{ autogenerate: { directory: "video-medier-og-laeremidler" } }],
        },
        {
          label: "Meebook og skoleår",
          collapsed: true,
          items: [{ autogenerate: { directory: "meebook" } }],
        },
        {
          label: "Links og genveje",
          collapsed: true,
          items: [{ autogenerate: { directory: "links-og-genveje" } }],
        },
      ],
    }),
  ],
});
