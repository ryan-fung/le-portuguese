# Contributing to Lê

Thank you for your interest in contributing to **Lê**, the European Portuguese pronunciation trainer! This guide will help you get started.

---

## Code of Conduct

Be respectful, constructive, and kind. This is a learning tool—keep the focus on making Portuguese pronunciation accessible to English speakers.

---

## Getting Started

### Prerequisites
- Node.js 22+ (LTS)
- Git
- A code editor (VS Code recommended)

### Setup
```bash
git clone https://github.com/YOUR_USERNAME/le-portuguese.git
cd le-portuguese
npm install
npm run dev
```

The app will open on `http://localhost:5173/`.

### Verify your setup
```bash
npm run typecheck   # Should pass with no errors
npm run lint        # Should pass clean
npm run test        # Should show 100 passing tests
npm run test:e2e    # Should show 14 passing Playwright tests
```

---

## Project Structure

Read `CLAUDE.md` for a full architecture overview. Key areas:

- **`src/core/g2p/`** — The grapheme-to-phoneme engine (European Portuguese phonology)
- **`src/data/`** — Phoneme inventory and curriculum content
- **`src/views/`** — The four main views (Reader, Lab, Drills, Learn)
- **`src/lib/`** — Shared utilities (audio, SRS, speech synthesis)
- **`e2e/`** — Playwright end-to-end tests

---

## How to Contribute

### 1. Find an Issue
Check the [Issues](https://github.com/YOUR_USERNAME/le-portuguese/issues) tab for open tasks. Look for labels like `good first issue`, `help wanted`, or `enhancement`.

If you want to work on something not listed, **open an issue first** to discuss it. This avoids duplicate work.

### 2. Fork & Branch
```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feat/add-brazilian-mode` (new feature)
- `fix/stress-assignment-bug` (bug fix)
- `docs/improve-readme` (documentation)
- `test/drills-coverage` (test improvements)

### 3. Make Your Changes

#### Code Style
- **TypeScript strict mode**: all code must typecheck with `npm run typecheck`
- **ESLint**: run `npm run lint` and fix all warnings
- **Tailwind utilities**: avoid custom CSS; use Tailwind classes
- **Imports**: use the `@/` alias for `src/` imports
- **Tests**: add tests for new features or bug fixes

#### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat(reader): add copy-to-clipboard for IPA transcription
fix(g2p): correct stress assignment for -im/-um endings
docs(readme): clarify audio sourcing process
test(drills): add coverage for listen-discriminate drills
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`

Scopes: `reader`, `lab`, `drills`, `learn`, `g2p`, `data`, `ui`, `ci`, etc.

### 4. Test Your Changes
```bash
npm run typecheck   # Must pass
npm run lint        # Must pass
npm run test        # Must pass (or add/update tests)
npm run build       # Must succeed
npm run test:e2e    # Should pass (or update e2e tests if you changed UI)
```

If you changed the G2P engine, add test cases in `src/core/g2p/portuguese.test.ts` with real Portuguese words that exercise your change.

### 5. Commit & Push
```bash
git add .
git commit -m "feat(reader): add copy-to-clipboard for IPA transcription"
git push origin feature/your-feature-name
```

### 6. Open a Pull Request
- Go to your fork on GitHub
- Click "Compare & pull request"
- Fill out the PR template:
  - **What does this PR do?** (summary)
  - **Why?** (motivation, linked issue)
  - **How was it tested?** (steps to verify)
  - **Screenshots** (if UI change)

The CI pipeline will run automatically. PRs must pass all checks (typecheck, lint, unit tests, e2e tests) before merge.

---

## Areas for Contribution

### 🐛 Bug Fixes
- G2P engine edge cases (wrong stress, wrong vowel quality)
- UI glitches or accessibility issues
- Drill logic bugs (wrong answer marked correct, SRS scheduling issues)

### ✨ Features
- **Pronunciation dictionary**: override G2P defaults for common words where the rules fail (e.g. open vs close mid vowels)
- **Brazilian Portuguese mode**: add a toggle for Brazilian phonology (different vowel reduction, alveolar /t d/ before /i/, carioca /s/ → /ʃ/)
- **Audio recording**: let users record themselves and compare waveforms
- **More drills**: spelling drills, cloze tests, listening comprehension
- **Lesson content**: add more curriculum lessons (contractions, liaison, intonation)
- **Cloud sync**: optional user accounts with Firebase/Supabase to sync progress across devices

### 📚 Content
- **Phoneme audio**: source or record native pt-PT audio for all 39 phonemes
- **Example words**: add more example words to phoneme inventory
- **Curriculum lessons**: write new lessons or improve existing ones
- **Contrasts**: add more minimal pairs to `phonemes.ts` (e.g. ɨ/i, ɐ/a, ɾ/ʁ)

### 🧪 Tests
- Increase G2P test coverage (more edge cases, longer words, real sentences)
- Add e2e tests for drill interactions (answer a drill, grade, advance)
- Add unit tests for SRS scheduling logic

### 📖 Documentation
- Improve README clarity
- Write a phonology explainer (why EP vowel reduction matters, how it differs from Brazilian)
- Add JSDoc comments to complex functions

### 🎨 Design
- Improve mobile UX (better tap targets, smoother animations)
- Add dark/light mode toggle (currently dark-only)
- Improve accessibility (more aria-labels, better keyboard nav, screen reader testing)

---

## G2P Engine Contributions

The grapheme-to-phoneme engine (`src/core/g2p/`) is the most linguistically complex part of the codebase. If you're contributing here:

1. **Read the existing code** in `portuguese.ts`, `syllabify.ts`, `stress.ts` to understand the two-phase architecture.
2. **Test with real words**: add test cases in `portuguese.test.ts` with the expected IPA output. Use real Portuguese words, not made-up examples.
3. **Document simplifications**: if you're approximating a complex rule, add a code comment explaining why and what the limitation is.
4. **Cite sources**: if you're implementing a phonological rule, cite the linguistic source (e.g. "EP stress follows the Latin default-penultimate pattern, except for words ending in -l/-r/-z...").

### Known G2P Limitations to Address
- Open vs closed mid vowels (ɛ/e, ɔ/o) are not predictable from unaccented spelling; need a pronunciation dictionary for common words.
- The letter `x` defaults to ʃ with a heuristic for `ex`+vowel → z; [ks] and [s] readings are not modeled.
- Rising diphthongs and hiatus are simplified; see `syllabify.ts`.

If you fix any of these, you're a hero.

---

## Phoneme Inventory Contributions

The phoneme data in `src/data/phonemes.ts` is the teaching content. If you're improving it:

- **English anchors** must be accurate and vivid for an English speaker who does NOT know IPA. Bad: "a close central unrounded vowel". Good: "a tiny swallowed 'uh', like the faint 'e' in 'roses'—often nearly disappears."
- **Examples** must be real Portuguese words, ideally common ones. Include the `gloss` (English meaning) when it helps.
- **Contrasts** should have a `note` explaining WHY English speakers confuse them, and ideally a minimal pair.
- **Audio paths** follow the convention `/audio/<id>.mp3`. If you add a phoneme (unlikely), update `phoneme-ids.ts` first.

---

## Testing Guidelines

### Unit Tests (Vitest)
- Co-locate tests: `foo.test.ts` next to `foo.ts`
- Use `describe()` blocks to group related tests
- Test both happy paths and edge cases
- Use `expect().toEqual()` for deep equality, `.toBe()` for primitives
- Mock external dependencies (don't make real network calls in unit tests)

### E2E Tests (Playwright)
- Tests live in `e2e/<view>.spec.ts`
- Use semantic selectors: `getByRole('button', { name: /read it/i })` over `locator('.btn-primary')`
- Add `aria-label` to components if needed for testability
- Keep tests fast: avoid unnecessary `waitForTimeout()`, use `waitForSelector()` or `expect().toBeVisible()` instead
- Screenshots on failure are auto-captured by Playwright

---

## Pull Request Checklist

Before submitting, ensure:
- [ ] Code follows the style guide (TypeScript strict, ESLint clean)
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes (all unit tests green)
- [ ] `npm run build` succeeds
- [ ] `npm run test:e2e` passes (or you've updated e2e tests for UI changes)
- [ ] Commit messages follow Conventional Commits
- [ ] New features have tests
- [ ] Bug fixes have a test case that would have caught the bug
- [ ] Documentation is updated (if API or UI changed)

---

## Questions?

- Open a [Discussion](https://github.com/YOUR_USERNAME/le-portuguese/discussions) for general questions
- Open an [Issue](https://github.com/YOUR_USERNAME/le-portuguese/issues) for bug reports or feature requests
- Tag maintainers in your PR if you need review

---

Thank you for contributing to Lê! Every improvement helps more English speakers learn to read Portuguese aloud with confidence.
