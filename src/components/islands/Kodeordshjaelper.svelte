<script lang="ts">
// Svelte 5 (runes). Suggests a memorable Danish passphrase that satisfies
// Ishøj Kommune's rules: ≥15 characters, no Æ/Ø/Å, no personal info.
// Tied directly to the "Hvordan kommer jeg ind på min Chromebook?" guide.

// Everyday Danish words without Æ/Ø/Å, easy to remember and type.
const words = [
  "kaffe",
  "cykel",
  "sommer",
  "vinter",
  "skole",
  "bord",
  "stol",
  "vindue",
  "have",
  "regn",
  "solskin",
  "musik",
  "bog",
  "penalhus",
  "tavle",
  "kridt",
  "frikvarter",
  "madpakke",
  "termokande",
  "blyant",
  "ferie",
  "fredag",
  "kalender",
  "computer",
  "naboen",
  "kanin",
  "delfin",
  "papir",
  "klokken",
];

let phrase = $state("");

function pick(): string {
  return words[Math.floor(Math.random() * words.length)];
}

function generate(): void {
  const chosen: string[] = [];
  // Keep adding distinct words until we comfortably clear the 15-char minimum.
  while (chosen.join("").length < 16) {
    const w = pick();
    if (!chosen.includes(w)) chosen.push(w);
  }
  phrase = chosen.join("");
}

let copied = $state(false);

async function copy(): Promise<void> {
  if (!phrase) return;
  try {
    await navigator.clipboard.writeText(phrase);
    copied = true;
    setTimeout(() => (copied = false), 1600);
  } catch {
    copied = false;
  }
}

// Generér først efter mount på klienten. $effect kører aldrig under SSR, så
// serveren udsender en tom (deterministisk) boks, og klienten fylder den ud
// én gang — uden hydrerings-mismatch fra Math.random().
$effect(() => {
  generate();
});

let length = $derived(phrase.length);
let longEnough = $derived(length >= 15);
</script>

<div class="kh">
  <p class="kh__hint">
    Her er et forslag til et stærkt kodeord. Det er nemt at huske og opfylder kommunens krav. Du kan
    altid lave et nyt.
  </p>

  <div class="kh__output">
    <code class="kh__phrase">{phrase}</code>
    <span class="kh__count" class:kh__count--ok={longEnough}>
      {length}
      tegn {longEnough ? "✓" : ""}
    </span>
  </div>

  <div class="kh__actions">
    <button type="button" class="kh__btn kh__btn--primary" onclick={generate}>
      Lav et nyt forslag
    </button>
    <button type="button" class="kh__btn" onclick={copy}>
      {copied ? "Kopieret ✓" : "Kopiér"}
    </button>
  </div>

  <p class="kh__note">
    Tip: Du kan også finde på din egen sætning, fx
    <em>"jeghaderatskiftekodeord"</em>. Undgå Æ, Ø, Å og dit eget navn.
  </p>
</div>

<style>
.kh {
  border: 1px solid var(--sl-color-gray-5);
  border-radius: var(--edb-radius, 0.5rem);
  background: var(--sl-color-bg-nav);
  padding: 1.1rem 1.25rem;
  margin: 1.25rem 0;
}
.kh__hint {
  margin: 0 0 0.85rem;
  font-size: var(--sl-text-sm);
  color: var(--sl-color-gray-2);
}
.kh__output {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem 1rem;
  padding: 0.75rem 1rem;
  border-radius: var(--edb-radius, 0.5rem);
  background: var(--edb-brand-soft);
  border: 1px dashed var(--sl-color-accent);
}
.kh__phrase {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  word-break: break-all;
  color: var(--sl-color-white);
  background: none;
}
.kh__count {
  margin-left: auto;
  font-size: var(--sl-text-xs);
  color: var(--sl-color-gray-3);
  white-space: nowrap;
}
.kh__count--ok {
  color: var(--edb-warm);
  font-weight: 600;
}
.kh__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.85rem;
}
.kh__btn {
  cursor: pointer;
  border-radius: var(--edb-radius, 0.5rem);
  border: 1px solid var(--sl-color-gray-5);
  background: var(--sl-color-bg);
  color: var(--sl-color-white);
  padding: 0.5rem 1rem;
  font-size: var(--sl-text-sm);
  font-weight: 500;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}
.kh__btn:hover {
  border-color: var(--sl-color-accent);
}
.kh__btn--primary {
  background: var(--sl-color-accent);
  border-color: var(--sl-color-accent);
  color: var(--sl-color-white);
}
.kh__btn--primary:hover {
  opacity: 0.92;
}
.kh__note {
  margin: 0.85rem 0 0;
  font-size: var(--sl-text-xs);
  color: var(--sl-color-gray-3);
}
</style>
