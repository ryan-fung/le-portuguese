/**
 * The Lê curriculum — a graded path that takes an English speaker from "I can't
 * read Portuguese at all" to "I can sound out any EP passage". Lessons are
 * ordered by `requires` (a DAG); each introduces a small set of sounds or a
 * spelling rule and ends with drills. The Learn view renders lessons; the Drills
 * view can pull drills from here or auto-generate from phoneme contrasts.
 *
 * Content is EP (Portugal): vowel reduction, hushing sibilants, uvular r, etc.
 * Phoneme ids referenced here must exist in src/core/phoneme-ids.ts.
 */

import type { Lesson } from '@/core/types'

export const CURRICULUM: Lesson[] = [
  {
    id: 'vowels-core',
    kind: 'sound',
    title: 'The five vowel letters',
    goal: 'Recognise the bright, stressed values of a, e, i, o, u.',
    phonemeIds: ['a-open', 'e-close', 'i-close', 'o-close', 'u-close'],
    body: [
      'Portuguese is written with the same five vowel letters as English, but each has a cleaner, more consistent sound when stressed.',
      'Stressed **a** is a bright "ah" (father). Stressed **e** is roughly "ay" (without the English glide). **i** is "ee". **o** is "oh". **u** is "oo".',
      'These are the *stressed* values. The big European Portuguese twist — what unstressed vowels turn into — comes next.',
    ].join('\n\n'),
    drills: [
      { id: 'vowels-core-d1', kind: 'sound-to-spell', prompt: 'Which word has the "ee" sound?', target: 'i-close', options: ['vi', 'vou', 'vá'], answer: 0 },
      { id: 'vowels-core-d2', kind: 'read-aloud', prompt: 'Read aloud, then check.', target: 'lua' },
    ],
  },
  {
    id: 'vowel-reduction',
    kind: 'spelling-rule',
    title: 'The vanishing vowels',
    goal: 'Predict how unstressed a, e, o weaken — the signature EP sound.',
    phonemeIds: ['a-central', 'e-central', 'u-close'],
    requires: ['vowels-core'],
    body: [
      'This is the single most important thing about European Portuguese, and the main way it differs from Brazilian.',
      'In **unstressed** syllables the vowels collapse:',
      '- unstressed **a** → a short "uh" (ɐ), like the a in "about"',
      '- unstressed **o** → "oo" (u), so *Lisboa* starts "leezh-BOA"',
      '- unstressed **e** → a tiny swallowed ghost vowel (ɨ) that often nearly disappears — *telefone* sounds like "tlɨ-FON".',
      'Because of this, you must know where the stress falls before you can pronounce a word. The Reader marks stress for you.',
    ].join('\n\n'),
    drills: [
      { id: 'vowel-reduction-d1', kind: 'read-aloud', prompt: 'Read aloud — watch the unstressed e and o.', target: 'telefone' },
      { id: 'vowel-reduction-d2', kind: 'read-aloud', prompt: 'The first o reduces to "oo".', target: 'Lisboa' },
      { id: 'vowel-reduction-d3', kind: 'read-aloud', prompt: 'Both unstressed vowels weaken.', target: 'pequeno' },
    ],
  },
  {
    id: 'open-vs-close',
    kind: 'contrast',
    title: 'Open vs closed: é/ê, ó/ô',
    goal: 'Hear and read the open/closed mid-vowel contrast that accents reveal.',
    phonemeIds: ['e-open', 'e-close', 'o-open', 'o-close'],
    requires: ['vowels-core'],
    body: [
      'Portuguese distinguishes **open** and **closed** versions of e and o, and the written accent tells you which.',
      '**é** and **ó** are open: *é* like "eh" (bet), *ó* like "aw" (thought). **ê** and **ô** are closed: "ay" and "oh".',
      'The classic pair is *avô* (grandfather, closed "oh") vs *avó* (grandmother, open "aw").',
    ].join('\n\n'),
    drills: [
      { id: 'open-vs-close-d1', kind: 'listen-discriminate', prompt: 'Which did you hear?', target: 'o-open', options: ['avô', 'avó'], answer: 1 },
      { id: 'open-vs-close-d2', kind: 'read-aloud', prompt: 'Open é.', target: 'café' },
    ],
  },
  {
    id: 'nasals',
    kind: 'sound',
    title: 'Nasal vowels and ão',
    goal: 'Read the nasal vowels and the famous -ão ending.',
    phonemeIds: ['a-nasal', 'o-nasal', 'ao-nasal', 'ae-nasal', 'oe-nasal'],
    requires: ['vowels-core'],
    body: [
      'A tilde (ã, õ) or a vowel before m/n at the end of a syllable makes the vowel **nasal** — pushed through the nose, with the m/n itself not really pronounced.',
      'English has no nasal vowels, so anchor to French: *bon*, *vin*. *mãe* (mother), *pão* (bread), *põe* (puts).',
      'The **-ão** ending (*não*, *coração*, *pão*) is the most recognisable Portuguese sound: a nasal "ow" gliding into "ng".',
    ].join('\n\n'),
    drills: [
      { id: 'nasals-d1', kind: 'read-aloud', prompt: 'The -ão ending.', target: 'coração' },
      { id: 'nasals-d2', kind: 'read-aloud', prompt: 'Nasal diphthong.', target: 'mãe' },
      { id: 'nasals-d3', kind: 'listen-discriminate', prompt: 'Oral or nasal?', target: 'a-nasal', options: ['lá', 'lã'], answer: 1 },
    ],
  },
  {
    id: 'hushing-s',
    kind: 'spelling-rule',
    title: 'The hushing s',
    goal: 'Know when s and z turn into "sh" and "zh".',
    phonemeIds: ['sh', 'zh', 's', 'z'],
    requires: ['vowels-core'],
    body: [
      'At the **end of a syllable or word**, s, z and x become a hush: "sh" (ʃ) before a pause or voiceless sound, "zh" (ʒ) before a voiced one.',
      'So *livros* ends "vroosh", *Lisboa* has a "zh", and the plural -s everywhere becomes "sh". This gives EP its whispery texture.',
      'Between two vowels a single **s** is voiced to "z": *casa* = "KAH-zuh". A double **ss** stays "s": *passo*.',
    ].join('\n\n'),
    drills: [
      { id: 'hushing-s-d1', kind: 'read-aloud', prompt: 'Final s → sh.', target: 'livros' },
      { id: 'hushing-s-d2', kind: 'read-aloud', prompt: 'Intervocalic s → z.', target: 'casa' },
      { id: 'hushing-s-d3', kind: 'read-aloud', prompt: 's → zh before a voiced consonant.', target: 'cisne' },
    ],
  },
  {
    id: 'digraphs',
    kind: 'spelling-rule',
    title: 'lh, nh, ch and the tap/uvular r',
    goal: 'Read the consonant digraphs and the two r sounds.',
    phonemeIds: ['lh', 'nh', 'sh', 'r-tap', 'r-uvular'],
    requires: ['vowels-core'],
    body: [
      '**lh** = "ly" (ʎ), like the lli in "million": *filho*. **nh** = "ny" (ɲ), like the ni in "onion": *vinho*. **ch** = "sh": *chave*.',
      'There are two r sounds. A single **r** between vowels is a quick tap (ɾ), like the tt in American "butter": *caro*. A double **rr**, or an r at the start of a word, is a raspy throat r (ʁ) like the French r: *carro*, *rua*.',
      '*caro* (cheap) vs *carro* (car) is the minimal pair to master.',
    ].join('\n\n'),
    drills: [
      { id: 'digraphs-d1', kind: 'listen-discriminate', prompt: 'Tap or uvular r?', target: 'r-uvular', options: ['caro', 'carro'], answer: 1 },
      { id: 'digraphs-d2', kind: 'read-aloud', prompt: 'nh = "ny".', target: 'vinho' },
      { id: 'digraphs-d3', kind: 'read-aloud', prompt: 'lh = "ly".', target: 'filho' },
    ],
  },
  {
    id: 'dark-l',
    kind: 'sound',
    title: 'The dark l',
    goal: 'Read syllable-final l as a dark "ull".',
    phonemeIds: ['l', 'l-dark'],
    requires: ['vowels-core'],
    body: [
      'At the end of a syllable, Portuguese **l** is "dark" (ɫ) — pronounced with the back of the tongue raised, like the ll in English "ball" or "full". It does NOT become a "w" the way Brazilian Portuguese does.',
      '*animal*, *Portugal*, *sol* all end with this dark l. At the start of a syllable (*lua*, *gelo*) l is the ordinary light l.',
    ].join('\n\n'),
    drills: [
      { id: 'dark-l-d1', kind: 'read-aloud', prompt: 'Dark final l.', target: 'animal' },
      { id: 'dark-l-d2', kind: 'read-aloud', prompt: 'Dark final l.', target: 'Portugal' },
    ],
  },
  {
    id: 'passage-1',
    kind: 'passage',
    title: 'Read your first passage',
    goal: 'Put it together: read a short real EP passage aloud.',
    phonemeIds: [],
    requires: ['vowel-reduction', 'nasals', 'hushing-s', 'digraphs'],
    body: [
      'Time to read for real. Open this in the Reader and sound it out syllable by syllable, watching for vowel reduction, hushing s, and the nasal endings.',
      '"Bom dia. Um café e um pastel de nata, por favor."',
      'You do not need to know what it means (it orders a coffee and a custard tart). You only need to pronounce it — and now you can.',
    ].join('\n\n'),
    drills: [
      { id: 'passage-1-d1', kind: 'read-aloud', prompt: 'Read the whole line aloud.', target: 'Bom dia. Um café e um pastel de nata, por favor.' },
    ],
  },
]

export const CURRICULUM_BY_ID: Record<string, Lesson> = Object.fromEntries(
  CURRICULUM.map((l) => [l.id, l]),
)

/** All drills across the curriculum, flattened. */
export const ALL_DRILLS = CURRICULUM.flatMap((l) => l.drills)
