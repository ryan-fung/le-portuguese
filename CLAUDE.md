# Lê — European Portuguese Pronunciation Trainer

**Lê** (Portuguese: "read") is a progressive web app that teaches English speakers to read and pronounce European Portuguese aloud, even if they don't know what the words mean. The app focuses on the signature phonological features that distinguish European Portuguese from Brazilian Portuguese: vowel reduction, hushing sibilants, the uvular r, and the near-disappearing central vowel ɨ.

Built with React 19, TypeScript, and Tailwind v4. Deployed to Cloudflare Pages.

---

## What Lê Does

### Reader (the centerpiece)
Paste any Portuguese text and see it broken down sound-by-sound into color-coded syllable tiles. Each tile shows:
- The grapheme (spelling)
- The IPA transcription
- An English-facing respelling
- Stress marking

Tap any sound to learn its articulation, hear its audio, and see minimal pairs. The Reader uses a custom grapheme-to-phoneme engine tuned specifically for European Portuguese phonology.

### Sound Lab
An explorable reference of all 39 European Portuguese phonemes, organized by category (oral vowels, nasal vowels, consonants, etc.). Each sound card shows:
- IPA symbol
- English "sounds like" anchor for learners who don't know IPA
- How to articulate it
- Example words
- Contrasts with sounds English speakers commonly confuse

### Drills
Spaced-repetition practice using the FSRS algorithm. Four drill types:
- **Listen-discriminate**: hear a word, pick which of two you heard (e.g. *caro* vs *carro*)
- **Read-aloud**: read a word yourself, hear the reference, self-grade
- **Sound-to-spell**: match a sound to its spelling
- **Spell-to-sound**: match spelling to pronunciation

Drills are auto-generated from the curriculum lessons and from phoneme minimal pairs.

### Learn
A guided curriculum of 8 lessons forming a prerequisite graph:
1. Core vowels
2. Vowel reduction (the signature EP feature)
3. Open vs closed mid vowels (é/ê, ó/ô)
4. Nasal vowels and -ão
5. The hushing s
6. Digraphs (lh, nh, ch) and the r contrast
7. The dark l
8. First passage

Each lesson introduces sounds, explains the spelling rules, and ends with drills.

---

## Architecture

```
src/
├── core/
│   ├── types.ts              # Domain types (Phoneme, WordAnalysis, Lesson, Drill)
│   ├── phoneme-ids.ts        # Canonical 39-phoneme registry (single source of truth)
│   └── g2p/                  # Grapheme-to-phoneme engine
│       ├── portuguese.ts     # Main analyzer (two-phase: stress → realization)
│       ├── syllabify.ts      # Orthographic syllable splitter
│       ├── stress.ts         # EP stress assignment rules
│       └── respell.ts        # IPA → English respelling map
├── data/
│   ├── phonemes.ts           # Full phoneme inventory with teaching content
│   └── curriculum.ts         # 8-lesson curriculum with drills
├── lib/
│   ├── speech.ts             # TTS via Web Speech API (pt-PT) with voice quality detection
│   ├── usePhonemeAudio.ts    # Phoneme audio playback hook
│   ├── srs.ts                # ts-fsrs wrapper
│   ├── segmentStyle.ts       # Color coding for segment tiles
│   ├── tokenize.ts           # Split pasted text into words
│   └── miniMarkdown.tsx      # Tiny safe markdown renderer for lesson bodies
├── views/
│   ├── ReaderView.tsx
│   ├── LabView.tsx
│   ├── DrillsView.tsx
│   └── LearnView.tsx
├── components/
│   ├── Nav.tsx               # Bottom nav (mobile) / sidebar (desktop)
│   ├── VoiceQualityBanner.tsx # Dismissible banner prompting iOS/macOS users to download enhanced voice
│   └── VoiceQualityBanner.css # Slide-down banner styling
├── store.ts                  # Zustand store with persist (progress, SRS, prefs)
└── App.tsx                   # Route orchestration + lazy loading
```

### The G2P Engine
The grapheme-to-phoneme engine is a **two-phase pipeline**:
1. **Structure phase**: syllabify the word, assign stress (oxytone vs paroxytone rules)
2. **Realization phase**: walk each syllable's onset/nucleus/coda and emit phoneme IDs using context-sensitive rules

This two-pass approach is necessary because **vowel realization depends on stress** — the defining feature of European Portuguese. Unstressed vowels reduce:
- `a` → ɐ (schwa)
- `e` → ɨ (close central, the "ghost vowel")
- `o` → u

Other key rules the engine models:
- Final/preconsonantal `s`/`z` → ʃ or ʒ (hushing)
- Intervocalic single `s` → z (voicing)
- Word-initial `r` and `rr` → ʁ (uvular); single intervocalic `r` → ɾ (tap)
- Syllable-final `l` → ɫ (dark l)
- Nasalization: vowel + coda m/n → nasal vowel (the m/n is absorbed)

The engine emits only phoneme IDs that exist in the canonical registry (`src/core/phoneme-ids.ts`). A unit test enforces this contract.

### State Management
- **Zustand** with `persist` middleware saves to localStorage:
  - `seenPhonemes`, `completedLessons`, `recentTexts`
  - SRS cards (one per drill, keyed `drill:<id>`)
  - UI prefs (`showIpa`, `showRespelling`, `speechRate`)
- Route is deliberately *not* persisted — the app always opens to the Reader.

### Audio
- **Phoneme clips**: bundled MP3s under `public/audio/<id>.mp3` (one per phoneme)
- **Word/passage TTS**: Web Speech API with pt-PT voice
  - Uses the browser's native Portuguese (Portugal) voice
  - On iOS/macOS, the app prompts users to download the high-quality Siri enhanced voice if not detected
  - Voice quality detection logic in `src/lib/speech.ts` checks for premium/enhanced pt-PT voices
  - A dismissible banner (`VoiceQualityBanner` component) guides users to Settings → Accessibility → Spoken Content → Voices
  - Banner appears once per session (stored in sessionStorage)

---

## Development

### Prerequisites
- Node 22+ (LTS)
- npm or pnpm

### Commands
```bash
npm install
npm run dev          # Vite dev server on :5173
npm run build        # tsc + vite build → dist/
npm run preview      # Serve the built app on :4173
npm run typecheck    # tsc --noEmit (strict mode)
npm run lint         # eslint
npm run test         # Vitest unit tests (100 passing)
npm run test:watch   # Vitest watch mode
npm run test:e2e     # Playwright e2e tests (14 passing, chromium only)
```

### Project structure conventions
- Strict TypeScript: `noUnusedLocals`, `noUnusedParameters`, `strict` all on
- Imports use `@/` alias mapped to `src/`
- All phoneme IDs are validated at runtime via `isPhonemeId()` from the registry
- Tests are co-located: `<module>.test.ts` next to `<module>.ts`

---

## CI/CD

GitHub Actions pipeline in `.github/workflows/ci.yml`:
1. **quality** job: typecheck, lint, unit tests (Vitest)
2. **e2e** job: Playwright (chromium only, caches browsers)
3. **deploy** job: builds and deploys to Cloudflare Pages via `wrangler-action` (only on push to `main`)

### Secrets required
- `CLOUDFLARE_API_TOKEN` — token with Cloudflare Pages:Edit permission
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID

The Cloudflare Pages project must be named **`le-portuguese`** (matches `--project-name` in the deploy step).

---

## Deployment

### Docker (optional)
A multi-stage `Dockerfile` is provided:
- Stage 1 (builder): `node:22-alpine`, `npm ci`, `npm run build`
- Stage 2 (runtime): `nginx:alpine`, serves `dist/` with SPA fallback, immutable asset caching, and no-cache for `index.html`/`sw.js`

```bash
docker build -t le-portuguese .
docker run -p 8080:80 le-portuguese
```

### Cloudflare Pages (primary)
Push to `main` → CI builds and deploys automatically. The deploy URL will be `le-portuguese.pages.dev` or your custom domain.

---

## Testing

### Unit tests (Vitest)
- G2P engine: 87 tests across `portuguese.test.ts`, `syllabify.test.ts`, `stress.test.ts`
- Phoneme inventory: 9 tests ensuring id/registry sync and teaching content completeness
- Curriculum: 5 tests validating the lesson DAG, drill ids, and phoneme references
- SRS wrapper: 8 tests covering scheduling, due dates, and JSON round-trip

Run: `npm run test`

### E2E tests (Playwright)
- 14 tests across `reader.spec.ts`, `lab.spec.ts`, `drills.spec.ts`, `learn.spec.ts`, `shell.spec.ts`
- Covers: text analysis, segment tiles, phoneme modals, navigation, search, drill start screen, lesson path
- Chromium-only in CI (mobile-safari has timing issues with lazy-loaded views)

Run: `npm run test:e2e`

---

## Known Limitations

### G2P engine simplifications
- **Open vs closed mid vowels**: Stressed unaccented `e` and `o` default to close (ê/ô quality). The open variants (ɛ/ɔ) are not predictable from spelling without an accent mark. This means words like *guerra* and *melhor* get /e/ and /o/ where the real pronunciation is /ɛ/ and /ɔ/. Explicit accents (é, ó) are handled correctly.
- **The letter x**: defaults to ʃ with a heuristic for `ex` + vowel → z (e.g. *exame*). The [ks] and [s] readings (*táxi*, *próximo*) are not modelled.
- **Rising diphthongs and hiatus**: simplified; see notes in `syllabify.ts`.

### Audio
- Phoneme clips are sourced from public-domain recordings or generated as placeholders (see workflow output).
- TTS depends on device voices. On iOS/macOS, users need to manually download the enhanced Portuguese (Portugal) voice for best quality. The app prompts users when a high-quality voice is not detected.

### No cloud sync
- Progress (SRS cards, completed lessons, seen phonemes) is localStorage-only. No user accounts.

---

## Future Work
- Improve G2P: add a pronunciation dictionary for common words where the default rules fail (open/close mid vowels, x variants).
- Record native pt-PT phoneme audio clips if placeholders were used.
- Add a "slow mode" TTS option (even slower than 0.85 rate).
- Cloud sync via optional user accounts.
- More lessons: contractions, liaison, intonation patterns.

---

## Credits
Built by Claude Opus 4.8 in collaboration with Ryan Fung, June 2026.

Phoneme inventory and G2P rules synthesized from linguistics research on European Portuguese phonology. Example words and curriculum content chosen to highlight EP-specific features.

Audio (if sourced): Wikimedia Commons IPA recordings (public domain).

---

## License
MIT (or specify your license)
