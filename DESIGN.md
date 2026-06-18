# Lê Design System

Design principles and visual language for the European Portuguese pronunciation trainer.

---

## Principles

### 1. **Calm First**
The app is a learning tool, not entertainment. The dark slate theme (slate-900/950) reduces eye strain during extended reading practice sessions. Generous spacing and soft shadows prevent visual clutter.

**Future: Light Mode**
Add a theme toggle with a sophisticated light mode:
- **Light backgrounds**: warm white (zinc-50/slate-50) instead of pure white to reduce harshness
- **Light text**: slate-800/zinc-900 for body, slate-600 for secondary
- **Segment tiles**: maintain the color categories but with lighter tints (emerald-100 bg with emerald-700 text, etc.)
- **Amber accent**: darken slightly to amber-500/amber-600 for sufficient contrast on light backgrounds
- **Persist preference**: store in Zustand alongside `showIpa`/`showRespelling`

The phoneme color system should remain consistent across themes—emerald always means vowel, violet always means nasal—but the lightness/saturation adjusts per theme.

### 2. **Color as Information**
Color encodes phonetic categories at a glance:
- **Emerald** (vowels) — the open, flowing sounds
- **Violet** (nasal vowels/diphthongs) — the signature Portuguese nasality
- **Indigo** (voiced consonants) — resonant sounds with vocal fold vibration
- **Sky** (voiceless consonants) — breathy, whispered sounds
- **Teal** (glides/semivowels) — the in-between sounds
- **Amber** (primary actions, stress marks, signature sounds) — warmth and emphasis

Silent letters are muted and struck through. This color system is consistent across the Reader tiles and Sound Lab cards.

### 3. **English-First Pedagogy**
The target audience does NOT know IPA. Every phoneme's **English anchor** ("sounds like...") is the visual hero, set in amber. IPA is secondary, shown in a smaller `.ipa` class. Respellings use ASCII (sh, zh, oo, uh) so learners can sound out words without special knowledge.

### 4. **Mobile-First Responsive**
- Bottom nav on phones (with `safe-area-inset-bottom` padding), sidebar on desktop
- Segment tiles min 44px tap targets
- Views adapt from 2-col phone grids to 5+ cols on wide screens
- Lazy-loaded views keep the initial bundle small

### 5. **Subtle Motion**
Framer Motion provides tasteful spring animations on modals, route transitions, and grid filtering. Motion is a flourish, not a distraction—keep it under 400ms and use natural easing.

---

## Colors

### Palette

**Current: Dark Theme**
```css
/* Backgrounds */
--slate-950: #020617   /* body bg */
--slate-900: #0f172a   /* cards, inputs */
--slate-800: #1e293b   /* hover states */

/* Text */
--slate-100: #f1f5f9   /* primary text */
--slate-400: #94a3b8   /* secondary text */
--slate-500: #64748b   /* muted text */
--slate-600: #475569   /* disabled */

/* Primary (accent) */
--amber-400: #fbbf24   /* primary actions, stressed syllables, "Lê" branding */
--amber-300: #fcd34d   /* hover */
--amber-200: #fde68a   /* focus rings */

/* Phoneme categories */
--emerald-500: #10b981 /* oral vowels */
--violet-500:  #8b5cf6 /* nasal vowels */
--indigo-500:  #6366f1 /* voiced consonants */
--sky-500:     #0ea5e9 /* voiceless consonants */
--teal-500:    #14b8a6 /* glides */

/* Semantic */
--green-500:   #22c55e /* correct answer */
--red-500:     #ef4444 /* incorrect answer */
```

**Future: Light Theme**
```css
/* Light backgrounds */
--zinc-50:  #fafafa    /* body bg (warm white) */
--slate-50: #f8fafc    /* alternate bg */
--white:    #ffffff    /* cards */
--slate-100: #f1f5f9   /* hover states */

/* Light text */
--slate-900: #0f172a   /* primary text */
--slate-700: #334155   /* secondary text */
--slate-600: #475569   /* muted text */
--slate-400: #94a3b8   /* disabled */

/* Primary (accent for light) */
--amber-500: #f59e0b   /* actions, branding */
--amber-600: #d97706   /* hover */
--amber-400: #fbbf24   /* focus rings */

/* Phoneme categories (light mode tints) */
--emerald-100: #d1fae5 /* vowel bg */
--emerald-700: #047857 /* vowel text */
--violet-100:  #ede9fe /* nasal bg */
--violet-700:  #6d28d9 /* nasal text */
/* ...etc for other categories */
```

Use CSS custom properties or Tailwind's dark mode classes to switch between themes.

### Usage
- **Amber** is reserved for: primary CTA buttons, the "Lê" wordmark, stressed syllable underlines, signature EP sound badges, and focus rings on interactive elements.
- **Slate neutrals** for all chrome (nav, cards, inputs, borders).
- **Semantic greens/reds** only in drills for answer feedback.

---

## Typography

### Font Stack
**Current (system fonts)**:
```css
font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
```
System fonts for speed and native feel. The icon uses a serif (`Georgia, 'Times New Roman'`) to give "lê" a literary feel.

**Future: Sophisticated Pairing**
A more refined typographic system for v2:
- **Body/UI**: **Inter** or **Untitled Sans** — clean, highly legible geometric sans with excellent hinting
- **Headings/Emphasis**: **Fraunces** (variable font with optical sizing) — a warm, slightly quirky serif that conveys approachability while remaining serious. Its soft corners and italics feel literary without being stuffy.
- **IPA/Linguistic**: **Charis SIL** or **Source Serif** — both have comprehensive IPA coverage with proper diacritic placement

This pairing balances precision (Inter) with warmth (Fraunces), appropriate for a learning tool that's both rigorous and inviting. Variable fonts allow optical sizing (display weights for large text, text weights for body) from a single file.

Load via Google Fonts or self-host; preload the woff2 files for `font-display: swap`.

### IPA Glyphs
Apply the `.ipa` class to any IPA transcription:
```css
.ipa {
  font-family: 'Noto Sans', 'Doulos SIL', 'Charis SIL', 'DejaVu Sans', system-ui, sans-serif;
  font-feature-settings: 'liga' 1, 'calt' 1;
}
```
This ensures diacritics (combining tilde, length marks) render correctly. Fallback to system-ui is safe—modern OS fonts handle IPA adequately.

### Scales
- **Mobile body**: `text-base` (16px)
- **Desktop body**: `text-base` or `text-lg` where comfortable
- **Headings**: `text-2xl` / `text-xl` / `text-lg` — restrained hierarchy
- **Tiles/cards**: `text-sm` for labels, `text-lg` or `text-2xl` for the phoneme IPA glyph

---

## Components

### Segment Tiles (Reader, Learn)
A **segment tile** is the atomic unit of the Reader breakdown. Structure:
```
┌─────────────┐
│   grapheme  │  ← the spelling (e.g. "lh", "ão", "s")
│   ipa       │  ← IPA symbol (e.g. ʎ, ɐ̃w̃, ʃ) — .ipa class
│   respelling│  ← English hint (e.g. "ly", "owng", "sh")
└─────────────┘
```
- Background colour from `styleForSegment()` encodes the phoneme category.
- Stressed syllables get an amber underline.
- Silent letters render muted + struck-through.
- Min 44px tap target.
- Rounded corners (`rounded-lg`), subtle ring on focus-visible.

### Phoneme Cards (Sound Lab)
Grid tiles showing:
- **Large IPA glyph** (text-4xl, .ipa class)
- **Human name** below (text-xs, muted)
- **Amber star badge** in corner if `signatureEP: true`
- **Dot indicator** if the learner has explored this sound (`seenPhonemes`)

Hover: subtle scale-up, amber border. Use framer-motion `layout` for grid reflow when filtering.

### Modals (Phoneme Detail)
- **Desktop**: centered, max-w-2xl, backdrop-blur + dark overlay
- **Mobile**: slide up from bottom as a sheet, rounded top corners
- **Header**: tappable IPA glyph (plays audio), close button top-right
- **Body**: English anchor in amber as hero, then howTo, examples (speakable), contrasts
- **Dismiss**: Esc key, backdrop click, or close button
- Focus trap: move focus into the modal on open, restore on close

### Buttons
- **Primary (amber)**: CTA actions (Read it, Start session, Mark complete)
  ```tsx
  className="bg-amber-400 text-slate-950 hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-200"
  ```
- **Secondary (ghost)**: muted slate text, hover brightens
  ```tsx
  className="text-slate-400 hover:text-slate-200"
  ```
- **Icon-only**: aria-label required, visible focus ring
  ```tsx
  <button aria-label="Play sound" className="...">
    <Play size={20} />
  </button>
  ```

### Nav
- **Desktop (sidebar)**: fixed left, w-52, border-r slate-800, "Lê" wordmark at top
- **Mobile (bottom bar)**: fixed bottom, z-20, backdrop-blur, safe-area padding
- Active route: amber bg + text. Inactive: slate-400, hover slate-200.

---

## Spacing & Layout

### Grid & Wrap
- Use CSS grid or flex with `gap-*` (Tailwind). Never margin-based spacing—it's brittle.
- Reader results: `flex flex-wrap gap-2` so words wrap naturally.
- Sound Lab: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3`

### Padding
- Cards: `p-4` or `p-6`
- Buttons: `px-4 py-2` (text), `p-2` or `p-2.5` (icon-only)
- View containers: `p-6 sm:p-8 lg:p-12` for generous breathing room

### Borders & Rings
- Card borders: `border border-slate-700`
- Input borders: `border-slate-700` default, `border-amber-400/50` on focus
- Focus rings: `focus-visible:ring-2 ring-amber-400/30` (always visible, never `:focus` alone)

---

## Accessibility

### ARIA & Semantics
- Every icon-only button has `aria-label`
- Modals have `role="dialog"` and `aria-label` naming the content
- Toggles use `role="switch"` and `aria-checked`
- Progress indicators use `role="progressbar"` with `aria-valuenow`/`aria-valuemax`

### Keyboard
- All interactive elements reachable via Tab
- Modals dismiss with Esc
- Focus visible: amber ring on `:focus-visible`
- No keyboard traps (modals use focus-trap-react or equivalent)

### Color Contrast
- Slate-100 on slate-950: 16.1:1 (AAA)
- Amber-400 on slate-950: 10.5:1 (AAA)
- Muted slate-500 on slate-950: 5.2:1 (AA)

Phoneme tile backgrounds are intentionally low-contrast for calm aesthetics, but the text remains high-contrast (emerald-200, violet-200, etc. on their respective bg tints).

### Screen Readers
- Segment tiles announce "Sound <grapheme>: open detail"
- Example word buttons announce "Play the word <word>, meaning <gloss>"
- Use `aria-live="polite"` for drill feedback (correct/incorrect)

---

## Motion

### Framer Motion Patterns
```tsx
// Modal entrance
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 10 }}
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
>
```

```tsx
// Grid layout animation (when filtering)
<motion.div layout transition={{ duration: 0.2 }}>
```

```tsx
// Card hover
whileHover={{ scale: 1.02 }}
transition={{ duration: 0.15 }}
```

Keep it subtle. Prefer spring physics over linear easing—feels more natural.

---

## Icons

Use **Lucide React**:
- `<BookOpen />` — Reader
- `<Sparkles />` — Sound Lab
- `<Headphones />` — Drills
- `<Mic2 />` — Learn
- `<Play />`, `<Pause />`, `<Volume2 />`, `<VolumeX />`, etc.

Size: `size={20}` for inline icons, `size={16}` for tight spaces, `size={24}` for hero icons.

---

## PWA

### Manifest
- `name: "Lê — Read Portuguese Aloud"`
- `short_name: "Lê"`
- `theme_color: #fbbf24` (amber-400)
- `background_color: #0f172a` (slate-900)
- Icons: 192px, 512px, 512px maskable (with safe-zone padding), apple-touch-icon 180px

### Service Worker
vite-plugin-pwa generates a Workbox SW in `generateSW` mode. Precaches all build assets. Cache-first for hashed chunks, network-first for `index.html` and `sw.js`.

---

## Responsive Breakpoints

Tailwind's default breakpoints:
- `sm`: 640px (tablet portrait)
- `md`: 768px (tablet landscape)
- `lg`: 1024px (small desktop)
- `xl`: 1280px (desktop)

Design mobile-first. Use `sm:` prefix for tablet-up, `lg:` for desktop-specific enhancements.

---

## File Naming & Organisation

```
src/views/<ViewName>View.tsx        # Main view export
src/views/<view-name>/<Component>.tsx  # View-specific components
src/components/<Component>.tsx      # Shared components (Nav, etc.)
src/lib/<util>.ts                   # Pure utility functions/hooks
```

Components are PascalCase, utilities are kebab-case, test files are `<name>.test.ts`.

---

## Code Style

- **Tailwind**: utility-first, no custom CSS except `.ipa` font override
- **Props**: destructure in the parameter, type with interfaces
- **State**: Zustand for global, useState/useReducer for local
- **Effects**: sparingly—most logic is event-driven
- **Accessibility**: aria-label on all icon buttons, role on custom widgets

Keep components small (<200 lines). Extract repeated patterns into shared components under `src/components/` or view-local helpers.

---

This design system is a living guide—adjust as the app evolves, but maintain the calm dark aesthetic, information-rich color coding, and accessibility-first interactions.
