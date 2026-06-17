/**
 * European Portuguese (EP) phoneme inventory — the teaching data behind the
 * Sound Lab reference view and lesson content.
 *
 * Every entry is an English-anchored description tuned for a learner who does
 * NOT know IPA. The `englishAnchor` is the headline: a vivid, accurate "sounds
 * like" comparison. Articulatory feature fields mirror the registry in
 * `src/core/phoneme-ids.ts`, and there is EXACTLY ONE Phoneme per registry id.
 *
 * This is EP (Portugal), not Brazilian PT: unstressed vowel reduction, the
 * uvular ʁ, dark ɫ, and the swallowed central vowel ɨ are all reflected here.
 */

import type { Phoneme } from '@/core/types'

export const PHONEMES: Phoneme[] = [
  // ---------------------------------------------------------------------------
  // Oral vowels
  // ---------------------------------------------------------------------------
  {
    id: 'a-open',
    ipa: 'a',
    name: 'Open central unrounded vowel',
    type: 'vowel',
    height: 'open',
    backness: 'central',
    rounded: false,
    nasal: false,
    englishAnchor: "a bright, open 'ah' like the 'a' in 'father' — the fully stressed Portuguese a",
    howTo: 'Drop your jaw and keep the tongue low and flat. Lips relaxed and unrounded, voice on.',
    mnemonic: "Open wide and say 'ah' for the doctor.",
    examples: [
      { word: 'pá', highlight: 'á', gloss: 'spade' },
      { word: 'mar', highlight: 'a', gloss: 'sea' },
      { word: 'falo', highlight: 'a', gloss: 'I speak' },
    ],
    contrasts: [
      {
        withId: 'a-central',
        note: "Open 'a' (ah) is the stressed sound; the central ɐ is the short, swallowed 'uh' you hear in unstressed syllables. Compare the two a's in 'cama'.",
        pair: ['falo', 'falar'],
      },
    ],
    audio: '/audio/a-open.mp3',
  },
  {
    id: 'a-central',
    ipa: 'ɐ',
    name: 'Near-open central unrounded vowel',
    type: 'vowel',
    height: 'near-open',
    backness: 'central',
    rounded: false,
    nasal: false,
    englishAnchor: "a short, relaxed 'uh' like the 'a' in 'about' or 'sofa' — the default unstressed a",
    howTo: 'Let the tongue rest in a neutral, central position with the jaw barely open. Keep it short and unstressed; do not let it brighten into a full ah.',
    mnemonic: "The lazy 'uh' that unstressed a's collapse into.",
    examples: [
      { word: 'cama', highlight: 'a', gloss: 'bed' },
      { word: 'falar', highlight: 'a', gloss: 'to speak' },
      { word: 'banana', highlight: 'a', gloss: 'banana' },
    ],
    contrasts: [
      {
        withId: 'a-open',
        note: "ɐ is the reduced 'uh'; a is the bright stressed 'ah'. In 'cama' the first a is open (ah) and the final a is the central uh.",
        pair: ['cama', 'falar'],
      },
      {
        withId: 'a-nasal',
        note: "Same tongue position, but a-nasal sends the air through the nose. Oral ɐ in 'cá' vs nasal ɐ̃ in 'lã'.",
        pair: ['dá', 'lã'],
      },
    ],
    signatureEP: true,
    audio: '/audio/a-central.mp3',
  },
  {
    id: 'e-open',
    ipa: 'ɛ',
    name: 'Open-mid front unrounded vowel',
    type: 'vowel',
    height: 'open-mid',
    backness: 'front',
    rounded: false,
    nasal: false,
    englishAnchor: "the short 'e' in 'bet' or 'pet' — an open, lax e",
    howTo: 'Spread the lips slightly into a relaxed smile, tongue forward and mid-low. Voice on, short and open.',
    examples: [
      { word: 'pé', highlight: 'é', gloss: 'foot' },
      { word: 'café', highlight: 'é', gloss: 'coffee' },
      { word: 'ferro', highlight: 'e', gloss: 'iron' },
    ],
    contrasts: [
      {
        withId: 'e-close',
        note: "ɛ is open like 'bet'; e-close is tighter, like the start of 'they'. Hear it in the accent marks: é (open) vs ê (close).",
        pair: ['pé', 'mês'],
      },
    ],
    audio: '/audio/e-open.mp3',
  },
  {
    id: 'e-close',
    ipa: 'e',
    name: 'Close-mid front unrounded vowel',
    type: 'vowel',
    height: 'close-mid',
    backness: 'front',
    rounded: false,
    nasal: false,
    englishAnchor: "the tense 'ay' in 'they' or 'cake', but cut short with no glide at the end",
    howTo: 'Tongue high and forward, lips slightly spread. Keep it pure — do not let it slide into an ee like the English ay often does.',
    examples: [
      { word: 'mês', highlight: 'ê', gloss: 'month' },
      { word: 'você', highlight: 'ê', gloss: 'you' },
      { word: 'medo', highlight: 'e', gloss: 'fear' },
    ],
    contrasts: [
      {
        withId: 'e-open',
        note: "e-close is tense (they) and e-open is lax (bet). The ê accent marks the close one.",
        pair: ['mês', 'pé'],
      },
      {
        withId: 'i-close',
        note: "e-close stops at an 'ay' quality; i-close is a full 'ee'. Keep the tongue a touch lower for e.",
        pair: ['vê', 'vi'],
      },
    ],
    audio: '/audio/e-close.mp3',
  },
  {
    id: 'e-central',
    ipa: 'ɨ',
    name: 'Close central unrounded vowel',
    type: 'vowel',
    height: 'close',
    backness: 'central',
    rounded: false,
    nasal: false,
    englishAnchor: "a tiny swallowed 'uh', like the faint 'e' in 'roses' or 'garden' — often nearly disappears",
    howTo: 'Barely open the mouth and make the shortest possible voiced murmur with the tongue high and central. In fast speech it can vanish entirely, squeezing the consonants together.',
    mnemonic: "The ghost vowel — Portuguese 'que' sounds almost like just 'k'.",
    examples: [
      { word: 'que', highlight: 'e', gloss: 'that / what' },
      { word: 'pedir', highlight: 'e', gloss: 'to ask for' },
      { word: 'sete', highlight: 'e', gloss: 'seven' },
    ],
    contrasts: [
      {
        withId: 'e-close',
        note: "ɨ is the reduced, almost-silent unstressed e; e-close is the full 'ay'. Most unstressed written e's become this faint ɨ in EP.",
        pair: ['pegar', 'pêssego'],
      },
      {
        withId: 'i-close',
        note: "Both are high, but ɨ is central and swallowed while i is a clear front 'ee'. Don't upgrade the ghost vowel into a bright ee.",
      },
    ],
    signatureEP: true,
    audio: '/audio/e-central.mp3',
  },
  {
    id: 'i-close',
    ipa: 'i',
    name: 'Close front unrounded vowel',
    type: 'vowel',
    height: 'close',
    backness: 'front',
    rounded: false,
    nasal: false,
    englishAnchor: "a clear 'ee' like in 'see' or 'machine'",
    howTo: 'Push the tongue high and far forward, lips spread. A bright, tense ee.',
    examples: [
      { word: 'vi', highlight: 'i', gloss: 'I saw' },
      { word: 'fim', highlight: 'i', gloss: 'end' },
      { word: 'aqui', highlight: 'i', gloss: 'here' },
    ],
    contrasts: [
      {
        withId: 'e-close',
        note: "i is a full 'ee'; e-close stops at 'ay'. Compare vi (I saw) with vê (he sees).",
        pair: ['vi', 'vê'],
      },
    ],
    audio: '/audio/i-close.mp3',
  },
  {
    id: 'o-open',
    ipa: 'ɔ',
    name: 'Open-mid back rounded vowel',
    type: 'vowel',
    height: 'open-mid',
    backness: 'back',
    rounded: true,
    nasal: false,
    englishAnchor: "the open 'aw' in 'or' or British 'hot' — lips rounded but jaw fairly open",
    howTo: 'Round the lips loosely and drop the jaw, tongue pulled back and low-mid. Voice on, open and short.',
    examples: [
      { word: 'avó', highlight: 'ó', gloss: 'grandmother' },
      { word: 'porta', highlight: 'o', gloss: 'door' },
      { word: 'sol', highlight: 'o', gloss: 'sun' },
    ],
    contrasts: [
      {
        withId: 'o-close',
        note: "ɔ is open (aw, as in avó 'grandmother'); o-close is tight (oh, as in avô 'grandfather'). The accent tells them apart: ó open, ô close.",
        pair: ['avó', 'avô'],
      },
    ],
    audio: '/audio/o-open.mp3',
  },
  {
    id: 'o-close',
    ipa: 'o',
    name: 'Close-mid back rounded vowel',
    type: 'vowel',
    height: 'close-mid',
    backness: 'back',
    rounded: true,
    nasal: false,
    englishAnchor: "the 'oh' in 'go' or 'note', but pure and clipped with no 'oo' glide at the end",
    howTo: 'Round the lips firmly, tongue back and high-mid. Hold it steady so it does not drift toward oo.',
    examples: [
      { word: 'avô', highlight: 'ô', gloss: 'grandfather' },
      { word: 'pôr', highlight: 'ô', gloss: 'to put' },
      { word: 'todo', highlight: 'o', gloss: 'all' },
    ],
    contrasts: [
      {
        withId: 'o-open',
        note: "o-close is tight 'oh' (avô grandfather); o-open is 'aw' (avó grandmother).",
        pair: ['avô', 'avó'],
      },
      {
        withId: 'u-close',
        note: "o-close stays at 'oh'; u-close is a full 'oo'. Unstressed written o usually reduces all the way to u in EP.",
        pair: ['avô', 'tu'],
      },
    ],
    audio: '/audio/o-close.mp3',
  },
  {
    id: 'u-close',
    ipa: 'u',
    name: 'Close back rounded vowel',
    type: 'vowel',
    height: 'close',
    backness: 'back',
    rounded: true,
    nasal: false,
    englishAnchor: "a full 'oo' like in 'boot' or 'rude'",
    howTo: 'Round and push the lips forward, tongue high and back. Tense and bright oo.',
    examples: [
      { word: 'tu', highlight: 'u', gloss: 'you (informal)' },
      { word: 'rua', highlight: 'u', gloss: 'street' },
      { word: 'azul', highlight: 'u', gloss: 'blue' },
    ],
    contrasts: [
      {
        withId: 'o-close',
        note: "u is a full 'oo'; o-close stops at 'oh'. Note that most unstressed o's are actually pronounced as this u in EP (e.g. the o in 'todo').",
        pair: ['tu', 'avô'],
      },
    ],
    audio: '/audio/u-close.mp3',
  },
  // ---------------------------------------------------------------------------
  // Nasal vowels
  // ---------------------------------------------------------------------------
  {
    id: 'a-nasal',
    ipa: 'ɐ̃',
    name: 'Nasal near-open central vowel',
    type: 'nasal-vowel',
    height: 'near-open',
    backness: 'central',
    rounded: false,
    nasal: true,
    englishAnchor: "the 'un' in French 'un' or the vowel in 'aunt' said through your nose — a central 'uh' with the air buzzing out the nostrils",
    howTo: 'Make the central ɐ but lower the soft palate so air flows through the nose. Do not actually pronounce an n or m at the end — the nasal lives in the vowel itself.',
    mnemonic: "Hum the 'uh' through your nose.",
    examples: [
      { word: 'lã', highlight: 'ã', gloss: 'wool' },
      { word: 'irmã', highlight: 'ã', gloss: 'sister' },
      { word: 'campo', highlight: 'am', gloss: 'field' },
    ],
    contrasts: [
      {
        withId: 'a-central',
        note: "Same mouth shape, but a-nasal routes air through the nose. Oral 'dá' (gives) vs nasal 'lã' (wool).",
        pair: ['dá', 'lã'],
      },
    ],
    signatureEP: true,
    audio: '/audio/a-nasal.mp3',
  },
  {
    id: 'e-nasal',
    ipa: 'ẽ',
    name: 'Nasal close-mid front vowel',
    type: 'nasal-vowel',
    height: 'close-mid',
    backness: 'front',
    rounded: false,
    nasal: true,
    englishAnchor: "the 'ay' of 'they' hummed through the nose, like a nasal 'eng' without finishing the g",
    howTo: 'Hold the tongue forward and high-mid as for e-close, then drop the soft palate so the sound resonates in the nose. No separate n is pronounced.',
    examples: [
      { word: 'pente', highlight: 'en', gloss: 'comb' },
      { word: 'tempo', highlight: 'em', gloss: 'time' },
      { word: 'vento', highlight: 'en', gloss: 'wind' },
    ],
    contrasts: [
      {
        withId: 'e-close',
        note: "Same front vowel, but nasalized. The n/m in spelling signals the nasality rather than a full consonant.",
      },
    ],
    audio: '/audio/e-nasal.mp3',
  },
  {
    id: 'i-nasal',
    ipa: 'ĩ',
    name: 'Nasal close front vowel',
    type: 'nasal-vowel',
    height: 'close',
    backness: 'front',
    rounded: false,
    nasal: true,
    englishAnchor: "the 'ee' of 'see' sent through the nose, like the vowel in 'seen' but with no real n",
    howTo: 'Make a bright ee with the tongue high and forward, and open the nasal passage so the air buzzes in the nose.',
    examples: [
      { word: 'fim', highlight: 'im', gloss: 'end' },
      { word: 'sim', highlight: 'im', gloss: 'yes' },
      { word: 'cinco', highlight: 'in', gloss: 'five' },
    ],
    contrasts: [
      {
        withId: 'i-close',
        note: "Oral 'ee' vs the same 'ee' nasalized. Compare 'vi' (oral) with 'sim' (nasal).",
        pair: ['vi', 'sim'],
      },
    ],
    audio: '/audio/i-nasal.mp3',
  },
  {
    id: 'o-nasal',
    ipa: 'õ',
    name: 'Nasal close-mid back vowel',
    type: 'nasal-vowel',
    height: 'close-mid',
    backness: 'back',
    rounded: true,
    nasal: true,
    englishAnchor: "the 'on' in French 'bon' — a rounded 'oh' humming through the nose",
    howTo: 'Round the lips for an oh and let the air flow through the nose instead of fully closing for an n.',
    examples: [
      { word: 'som', highlight: 'om', gloss: 'sound' },
      { word: 'ponte', highlight: 'on', gloss: 'bridge' },
      { word: 'onde', highlight: 'on', gloss: 'where' },
    ],
    contrasts: [
      {
        withId: 'o-close',
        note: "Oral 'oh' vs nasal 'oh'. The m/n in spelling marks the nasal resonance, not a separate consonant.",
      },
    ],
    audio: '/audio/o-nasal.mp3',
  },
  {
    id: 'u-nasal',
    ipa: 'ũ',
    name: 'Nasal close back vowel',
    type: 'nasal-vowel',
    height: 'close',
    backness: 'back',
    rounded: true,
    nasal: true,
    englishAnchor: "the 'oo' of 'boot' hummed through the nose, like the vowel in 'soon' without a finished n",
    howTo: 'Round the lips for a full oo and open the nasal passage so the sound resonates in the nose.',
    examples: [
      { word: 'um', highlight: 'um', gloss: 'one / a' },
      { word: 'atum', highlight: 'um', gloss: 'tuna' },
      { word: 'mundo', highlight: 'un', gloss: 'world' },
    ],
    contrasts: [
      {
        withId: 'u-close',
        note: "Oral 'oo' vs the same 'oo' nasalized, as in 'um' (one).",
      },
    ],
    audio: '/audio/u-nasal.mp3',
  },
  // ---------------------------------------------------------------------------
  // Nasal diphthongs
  // ---------------------------------------------------------------------------
  {
    id: 'ao-nasal',
    ipa: 'ɐ̃w̃',
    name: 'Nasal diphthong ão',
    type: 'diphthong',
    nasal: true,
    englishAnchor: "the famous 'ão' — start at a nasal 'uh' and glide into a nasal ' oo/w', roughly 'owng' said through the nose",
    howTo: 'Begin with the nasal central ɐ̃ and round the lips into a nasal w as you finish, all through the nose. Never add a hard ng.',
    mnemonic: "The sound at the end of 'não' — Portuguese for no.",
    examples: [
      { word: 'não', highlight: 'ão', gloss: 'no' },
      { word: 'mão', highlight: 'ão', gloss: 'hand' },
      { word: 'pão', highlight: 'ão', gloss: 'bread' },
    ],
    contrasts: [
      {
        withId: 'ae-nasal',
        note: "ão glides toward a nasal 'w' (owng); ãe glides toward a nasal 'y' (eyng). Compare 'mão' (hand) with 'mãe' (mother).",
        pair: ['mão', 'mãe'],
      },
    ],
    signatureEP: true,
    audio: '/audio/ao-nasal.mp3',
  },
  {
    id: 'ae-nasal',
    ipa: 'ɐ̃j̃',
    name: 'Nasal diphthong ãe',
    type: 'diphthong',
    nasal: true,
    englishAnchor: "a nasal 'uh' gliding into a nasal 'y', roughly 'eyng' through the nose",
    howTo: 'Start at the nasal central ɐ̃ and glide toward a nasal y (as in yes), keeping the air in the nose throughout.',
    examples: [
      { word: 'mãe', highlight: 'ãe', gloss: 'mother' },
      { word: 'pães', highlight: 'ãe', gloss: 'loaves of bread' },
      { word: 'cães', highlight: 'ãe', gloss: 'dogs' },
    ],
    contrasts: [
      {
        withId: 'ao-nasal',
        note: "ãe ends in a nasal 'y'; ão ends in a nasal 'w'. 'mãe' (mother) vs 'mão' (hand).",
        pair: ['mãe', 'mão'],
      },
    ],
    audio: '/audio/ae-nasal.mp3',
  },
  {
    id: 'oe-nasal',
    ipa: 'õj̃',
    name: 'Nasal diphthong õe',
    type: 'diphthong',
    nasal: true,
    englishAnchor: "a nasal rounded 'oh' gliding into a nasal 'y', roughly 'oyng' through the nose",
    howTo: 'Begin at the nasal õ with rounded lips and glide into a nasal y, all resonating in the nose.',
    examples: [
      { word: 'põe', highlight: 'õe', gloss: 'puts' },
      { word: 'lições', highlight: 'õe', gloss: 'lessons' },
      { word: 'limões', highlight: 'õe', gloss: 'lemons' },
    ],
    contrasts: [
      {
        withId: 'ae-nasal',
        note: "Both end in a nasal 'y', but õe starts rounded (oh) while ãe starts central (uh).",
      },
    ],
    audio: '/audio/oe-nasal.mp3',
  },
  // ---------------------------------------------------------------------------
  // Semivowels (glides)
  // ---------------------------------------------------------------------------
  {
    id: 'j-glide',
    ipa: 'j',
    name: 'Palatal approximant (y-glide)',
    type: 'semivowel',
    manner: 'approximant',
    place: 'palatal',
    voiced: true,
    englishAnchor: "the 'y' in 'yes' or the glide at the end of 'boy'",
    howTo: 'Raise the front of the tongue toward the hard palate without touching, gliding quickly into or out of the neighbouring vowel.',
    examples: [
      { word: 'pai', highlight: 'i', gloss: 'father' },
      { word: 'rei', highlight: 'i', gloss: 'king' },
      { word: 'mais', highlight: 'i', gloss: 'more' },
    ],
    audio: '/audio/j-glide.mp3',
  },
  {
    id: 'w-glide',
    ipa: 'w',
    name: 'Labial-velar approximant (w-glide)',
    type: 'semivowel',
    manner: 'approximant',
    place: 'velar',
    voiced: true,
    englishAnchor: "the 'w' in 'wet' or the glide at the end of 'cow'",
    howTo: 'Round the lips and raise the back of the tongue toward the soft palate, gliding quickly into or out of the neighbouring vowel.',
    examples: [
      { word: 'mau', highlight: 'u', gloss: 'bad' },
      { word: 'quatro', highlight: 'u', gloss: 'four' },
      { word: 'água', highlight: 'u', gloss: 'water' },
    ],
    audio: '/audio/w-glide.mp3',
  },
  // ---------------------------------------------------------------------------
  // Plosives
  // ---------------------------------------------------------------------------
  {
    id: 'p',
    ipa: 'p',
    name: 'Voiceless bilabial plosive',
    type: 'consonant',
    manner: 'plosive',
    place: 'bilabial',
    voiced: false,
    englishAnchor: "'p' as in 'spin' — but without the puff of air English puts on 'pin'",
    howTo: 'Press both lips together, build up air, and release. Keep the vocal cords silent and skip the English aspiration.',
    examples: [
      { word: 'pão', highlight: 'p', gloss: 'bread' },
      { word: 'copo', highlight: 'p', gloss: 'cup / glass' },
      { word: 'pai', highlight: 'p', gloss: 'father' },
    ],
    contrasts: [
      {
        withId: 'b',
        note: "p is voiceless, b is voiced. The only difference is whether the vocal cords buzz: 'pala' vs 'bala'.",
        pair: ['pala', 'bala'],
      },
    ],
    audio: '/audio/p.mp3',
  },
  {
    id: 'b',
    ipa: 'b',
    name: 'Voiced bilabial plosive',
    type: 'consonant',
    manner: 'plosive',
    place: 'bilabial',
    voiced: true,
    englishAnchor: "'b' as in 'bed'",
    howTo: 'Press both lips together and release while the vocal cords buzz.',
    examples: [
      { word: 'bola', highlight: 'b', gloss: 'ball' },
      { word: 'bem', highlight: 'b', gloss: 'well' },
      { word: 'cabo', highlight: 'b', gloss: 'cable / cape' },
    ],
    contrasts: [
      {
        withId: 'p',
        note: "b is voiced, p is voiceless. 'bala' (bullet) vs 'pala' (cap brim).",
        pair: ['bala', 'pala'],
      },
      {
        withId: 'v',
        note: "b fully closes the lips (a stop); v lets air hiss between lip and teeth. Keep them distinct in EP, unlike some Spanish accents.",
        pair: ['bela', 'vela'],
      },
    ],
    audio: '/audio/b.mp3',
  },
  {
    id: 't',
    ipa: 't',
    name: 'Voiceless dental plosive',
    type: 'consonant',
    manner: 'plosive',
    place: 'dental',
    voiced: false,
    englishAnchor: "'t' as in 'stop', with the tongue on the teeth — softer and crisper than English 't'",
    howTo: 'Touch the tongue tip to the back of the upper teeth (not the ridge behind them) and release. No puff of air, and it never softens to a ch sound as in Brazilian PT.',
    examples: [
      { word: 'tu', highlight: 't', gloss: 'you' },
      { word: 'pato', highlight: 't', gloss: 'duck' },
      { word: 'sete', highlight: 't', gloss: 'seven' },
    ],
    contrasts: [
      {
        withId: 'd',
        note: "t is voiceless, d is voiced. 'tom' (tone) vs 'dom' (gift).",
        pair: ['tom', 'dom'],
      },
    ],
    audio: '/audio/t.mp3',
  },
  {
    id: 'd',
    ipa: 'd',
    name: 'Voiced dental plosive',
    type: 'consonant',
    manner: 'plosive',
    place: 'dental',
    voiced: true,
    englishAnchor: "'d' as in 'dog', but with the tongue right on the upper teeth",
    howTo: 'Place the tongue tip against the back of the upper teeth and release with the vocal cords buzzing. It stays a hard d and never becomes a j sound as in Brazilian PT.',
    examples: [
      { word: 'dois', highlight: 'd', gloss: 'two' },
      { word: 'nada', highlight: 'd', gloss: 'nothing' },
      { word: 'dedo', highlight: 'd', gloss: 'finger' },
    ],
    contrasts: [
      {
        withId: 't',
        note: "d is voiced, t is voiceless. 'dom' (gift) vs 'tom' (tone).",
        pair: ['dom', 'tom'],
      },
    ],
    audio: '/audio/d.mp3',
  },
  {
    id: 'k',
    ipa: 'k',
    name: 'Voiceless velar plosive',
    type: 'consonant',
    manner: 'plosive',
    place: 'velar',
    voiced: false,
    englishAnchor: "'k' as in 'sky' — without the English puff of air",
    howTo: 'Press the back of the tongue against the soft palate, build air, and release. Vocal cords silent, no aspiration.',
    examples: [
      { word: 'casa', highlight: 'c', gloss: 'house' },
      { word: 'quero', highlight: 'qu', gloss: 'I want' },
      { word: 'boca', highlight: 'c', gloss: 'mouth' },
    ],
    contrasts: [
      {
        withId: 'g',
        note: "k is voiceless, g is voiced. 'cato' vs 'gato' (cat).",
        pair: ['cato', 'gato'],
      },
    ],
    audio: '/audio/k.mp3',
  },
  {
    id: 'g',
    ipa: 'ɡ',
    name: 'Voiced velar plosive',
    type: 'consonant',
    manner: 'plosive',
    place: 'velar',
    voiced: true,
    englishAnchor: "the hard 'g' in 'go' or 'gap' (never the soft g of 'gem')",
    howTo: 'Press the back of the tongue to the soft palate and release while the vocal cords buzz.',
    examples: [
      { word: 'gato', highlight: 'g', gloss: 'cat' },
      { word: 'gosto', highlight: 'g', gloss: 'I like' },
      { word: 'amigo', highlight: 'g', gloss: 'friend' },
    ],
    contrasts: [
      {
        withId: 'k',
        note: "g is voiced, k is voiceless. 'gato' (cat) vs 'cato'.",
        pair: ['gato', 'cato'],
      },
    ],
    audio: '/audio/g.mp3',
  },
  // ---------------------------------------------------------------------------
  // Fricatives
  // ---------------------------------------------------------------------------
  {
    id: 'f',
    ipa: 'f',
    name: 'Voiceless labiodental fricative',
    type: 'consonant',
    manner: 'fricative',
    place: 'labiodental',
    voiced: false,
    englishAnchor: "'f' as in 'fun'",
    howTo: 'Rest the upper teeth on the lower lip and push air through. Vocal cords silent.',
    examples: [
      { word: 'fome', highlight: 'f', gloss: 'hunger' },
      { word: 'café', highlight: 'f', gloss: 'coffee' },
      { word: 'falar', highlight: 'f', gloss: 'to speak' },
    ],
    contrasts: [
      {
        withId: 'v',
        note: "f is voiceless, v is voiced. 'faca' (knife) vs 'vaca' (cow).",
        pair: ['faca', 'vaca'],
      },
    ],
    audio: '/audio/f.mp3',
  },
  {
    id: 'v',
    ipa: 'v',
    name: 'Voiced labiodental fricative',
    type: 'consonant',
    manner: 'fricative',
    place: 'labiodental',
    voiced: true,
    englishAnchor: "'v' as in 'van'",
    howTo: 'Rest the upper teeth on the lower lip and push air through while the vocal cords buzz.',
    examples: [
      { word: 'vaca', highlight: 'v', gloss: 'cow' },
      { word: 'livro', highlight: 'v', gloss: 'book' },
      { word: 'vinho', highlight: 'v', gloss: 'wine' },
    ],
    contrasts: [
      {
        withId: 'f',
        note: "v is voiced, f is voiceless. 'vaca' (cow) vs 'faca' (knife).",
        pair: ['vaca', 'faca'],
      },
      {
        withId: 'b',
        note: "v hisses air between teeth and lip; b fully closes both lips. EP keeps these clearly separate.",
        pair: ['vela', 'bela'],
      },
    ],
    audio: '/audio/v.mp3',
  },
  {
    id: 's',
    ipa: 's',
    name: 'Voiceless alveolar fricative',
    type: 'consonant',
    manner: 'fricative',
    place: 'alveolar',
    voiced: false,
    englishAnchor: "'s' as in 'see' — but note that at the end of a syllable EP turns this into a 'sh'",
    howTo: 'Raise the tongue near the ridge behind the upper teeth and hiss air down the middle. Vocal cords silent.',
    examples: [
      { word: 'sapo', highlight: 's', gloss: 'toad' },
      { word: 'massa', highlight: 'ss', gloss: 'dough / pasta' },
      { word: 'cima', highlight: 'c', gloss: 'top' },
    ],
    contrasts: [
      {
        withId: 'z',
        note: "s is voiceless, z is voiced. A single s between vowels is voiced (z): 'caça' (hunt, ss) vs 'casa' (house, z).",
        pair: ['caça', 'casa'],
      },
      {
        withId: 'sh',
        note: "Front s (see) vs back sh (ship). In EP a syllable-final s is pronounced sh, so 'os' sounds like 'oosh'.",
        pair: ['selo', 'chelo'],
      },
    ],
    audio: '/audio/s.mp3',
  },
  {
    id: 'z',
    ipa: 'z',
    name: 'Voiced alveolar fricative',
    type: 'consonant',
    manner: 'fricative',
    place: 'alveolar',
    voiced: true,
    englishAnchor: "'z' as in 'zoo' — also the sound of a single 's' between two vowels in Portuguese",
    howTo: 'Raise the tongue toward the ridge behind the upper teeth, hiss air, and add voice so it buzzes.',
    examples: [
      { word: 'casa', highlight: 's', gloss: 'house' },
      { word: 'zero', highlight: 'z', gloss: 'zero' },
      { word: 'coisa', highlight: 's', gloss: 'thing' },
    ],
    contrasts: [
      {
        withId: 's',
        note: "z is voiced, s is voiceless. 'casa' (house, z) vs 'caça' (hunt, s).",
        pair: ['casa', 'caça'],
      },
      {
        withId: 'zh',
        note: "z is a front buzz (zoo); zh is the back buzz of 'measure'.",
      },
    ],
    audio: '/audio/z.mp3',
  },
  {
    id: 'sh',
    ipa: 'ʃ',
    name: 'Voiceless postalveolar fricative',
    type: 'consonant',
    manner: 'fricative',
    place: 'postalveolar',
    voiced: false,
    englishAnchor: "'sh' as in 'ship' — and the hallmark EP sound for any s at the end of a syllable",
    howTo: 'Pull the tongue back a little from the s position, round the lips slightly, and hiss. The lisp-like sh on word endings is one of the most recognizable EP traits.',
    mnemonic: "Lisbon (Lisboa) hisses: 'as portas' sounds like 'ash portash'.",
    examples: [
      { word: 'chave', highlight: 'ch', gloss: 'key' },
      { word: 'baixo', highlight: 'x', gloss: 'low' },
      { word: 'estás', highlight: 's', gloss: 'you are' },
    ],
    contrasts: [
      {
        withId: 's',
        note: "sh is pulled back (ship); s is forward (see). EP uses sh for syllable-final s, which English speakers often miss.",
        pair: ['chelo', 'selo'],
      },
      {
        withId: 'zh',
        note: "sh is voiceless, zh is voiced. Same mouth shape, only the vocal cords differ: 'cha' (sh) vs 'já' (zh).",
        pair: ['chá', 'já'],
      },
    ],
    signatureEP: true,
    audio: '/audio/sh.mp3',
  },
  {
    id: 'zh',
    ipa: 'ʒ',
    name: 'Voiced postalveolar fricative',
    type: 'consonant',
    manner: 'fricative',
    place: 'postalveolar',
    voiced: true,
    englishAnchor: "the 's' in 'measure' or 'vision' — a soft buzzing 'zh'",
    howTo: 'Set the tongue back as for sh, round the lips slightly, and add voice so it buzzes.',
    examples: [
      { word: 'já', highlight: 'j', gloss: 'already' },
      { word: 'gente', highlight: 'g', gloss: 'people' },
      { word: 'hoje', highlight: 'j', gloss: 'today' },
    ],
    contrasts: [
      {
        withId: 'sh',
        note: "zh is voiced, sh is voiceless. 'já' (already, zh) vs 'chá' (tea, sh).",
        pair: ['já', 'chá'],
      },
      {
        withId: 'z',
        note: "zh is the back buzz (measure); z is the front buzz (zoo).",
      },
    ],
    audio: '/audio/zh.mp3',
  },
  // ---------------------------------------------------------------------------
  // Nasals
  // ---------------------------------------------------------------------------
  {
    id: 'm',
    ipa: 'm',
    name: 'Bilabial nasal',
    type: 'consonant',
    manner: 'nasal',
    place: 'bilabial',
    voiced: true,
    englishAnchor: "'m' as in 'man'",
    howTo: 'Close both lips and let the voiced air flow out through the nose. At the end of a syllable it usually just nasalizes the vowel rather than sounding as a full m.',
    examples: [
      { word: 'mãe', highlight: 'm', gloss: 'mother' },
      { word: 'amor', highlight: 'm', gloss: 'love' },
      { word: 'cama', highlight: 'm', gloss: 'bed' },
    ],
    contrasts: [
      {
        withId: 'n',
        note: "m closes the lips; n raises the tongue to the ridge. 'mão' (hand) vs 'não' (no).",
        pair: ['mão', 'não'],
      },
    ],
    audio: '/audio/m.mp3',
  },
  {
    id: 'n',
    ipa: 'n',
    name: 'Alveolar nasal',
    type: 'consonant',
    manner: 'nasal',
    place: 'alveolar',
    voiced: true,
    englishAnchor: "'n' as in 'no'",
    howTo: 'Touch the tongue tip to the ridge behind the upper teeth and let voiced air out through the nose. At the end of a syllable it mainly nasalizes the preceding vowel.',
    examples: [
      { word: 'não', highlight: 'n', gloss: 'no' },
      { word: 'nada', highlight: 'n', gloss: 'nothing' },
      { word: 'banana', highlight: 'n', gloss: 'banana' },
    ],
    contrasts: [
      {
        withId: 'nh',
        note: "n is a plain tongue-tip n; nh is the palatal 'ny' of 'canyon'. 'sono' (sleep) vs 'sonho' (dream).",
        pair: ['sono', 'sonho'],
      },
    ],
    audio: '/audio/n.mp3',
  },
  {
    id: 'nh',
    ipa: 'ɲ',
    name: 'Palatal nasal',
    type: 'consonant',
    manner: 'nasal',
    place: 'palatal',
    voiced: true,
    englishAnchor: "the 'ny' in 'canyon' or the 'ñ' in Spanish 'mañana'",
    howTo: 'Press the middle of the tongue against the hard palate and send voiced air through the nose. One smooth sound, not n followed by y.',
    examples: [
      { word: 'sonho', highlight: 'nh', gloss: 'dream' },
      { word: 'vinho', highlight: 'nh', gloss: 'wine' },
      { word: 'manhã', highlight: 'nh', gloss: 'morning' },
    ],
    contrasts: [
      {
        withId: 'n',
        note: "nh is the palatal 'ny'; n is a plain n. 'sonho' (dream) vs 'sono' (sleep).",
        pair: ['sonho', 'sono'],
      },
    ],
    audio: '/audio/nh.mp3',
  },
  // ---------------------------------------------------------------------------
  // Liquids
  // ---------------------------------------------------------------------------
  {
    id: 'l',
    ipa: 'l',
    name: 'Alveolar lateral approximant',
    type: 'consonant',
    manner: 'lateral',
    place: 'alveolar',
    voiced: true,
    englishAnchor: "the clear 'l' in 'leaf' — the bright l that starts a syllable",
    howTo: 'Touch the tongue tip to the ridge behind the upper teeth and let voiced air flow around the sides. Keep it light and forward.',
    examples: [
      { word: 'lua', highlight: 'l', gloss: 'moon' },
      { word: 'gelo', highlight: 'l', gloss: 'ice' },
      { word: 'bola', highlight: 'l', gloss: 'ball' },
    ],
    contrasts: [
      {
        withId: 'l-dark',
        note: "Clear l (leaf) starts syllables; dark l (the heavy l of 'full') ends them. EP uses a very dark l at the end of words like 'mil'.",
        pair: ['lua', 'mil'],
      },
      {
        withId: 'lh',
        note: "l is a single bright l; lh is the palatal 'lli' of 'million'. 'velo' vs 'velho' (old).",
        pair: ['velo', 'velho'],
      },
    ],
    audio: '/audio/l.mp3',
  },
  {
    id: 'l-dark',
    ipa: 'ɫ',
    name: 'Velarized alveolar lateral (dark l)',
    type: 'consonant',
    manner: 'lateral',
    place: 'alveolar',
    voiced: true,
    englishAnchor: "the heavy, hollow 'l' at the end of 'full' or 'milk' — much darker than English, almost a 'w' colour",
    howTo: 'Touch the tongue tip to the ridge but pull the back of the tongue up and back toward the soft palate, giving a deep, dark resonance. EP uses this for any l at the end of a syllable.',
    mnemonic: "The 'oo'-tinged l Portuguese puts at the end of 'Portugal'.",
    examples: [
      { word: 'mil', highlight: 'l', gloss: 'thousand' },
      { word: 'sol', highlight: 'l', gloss: 'sun' },
      { word: 'Portugal', highlight: 'l', gloss: 'Portugal' },
    ],
    contrasts: [
      {
        withId: 'l',
        note: "Dark l ends syllables and is pulled back and hollow; clear l starts them and is bright. Contrast the l in 'mil' with the l in 'lua'.",
        pair: ['mil', 'lua'],
      },
    ],
    signatureEP: true,
    audio: '/audio/l-dark.mp3',
  },
  {
    id: 'lh',
    ipa: 'ʎ',
    name: 'Palatal lateral approximant',
    type: 'consonant',
    manner: 'lateral',
    place: 'palatal',
    voiced: true,
    englishAnchor: "the 'lli' in 'million' or the 'gli' in Italian — a single palatal l, not l plus y",
    howTo: 'Press the middle of the tongue against the hard palate and let voiced air flow around the sides. One smooth sound.',
    examples: [
      { word: 'velho', highlight: 'lh', gloss: 'old' },
      { word: 'filho', highlight: 'lh', gloss: 'son' },
      { word: 'mulher', highlight: 'lh', gloss: 'woman' },
    ],
    contrasts: [
      {
        withId: 'l',
        note: "lh is the palatal 'lli' of 'million'; l is a plain l. 'velho' (old) vs 'velo'.",
        pair: ['velho', 'velo'],
      },
    ],
    audio: '/audio/lh.mp3',
  },
  {
    id: 'r-tap',
    ipa: 'ɾ',
    name: 'Alveolar tap',
    type: 'consonant',
    manner: 'tap',
    place: 'alveolar',
    voiced: true,
    englishAnchor: "a single flicked 'r', like the quick 'tt' in American 'butter' or 'better'",
    howTo: 'Flick the tongue tip once against the ridge behind the upper teeth — one light tap, not a held r and not a roll.',
    examples: [
      { word: 'caro', highlight: 'r', gloss: 'expensive' },
      { word: 'mar', highlight: 'r', gloss: 'sea' },
      { word: 'prato', highlight: 'r', gloss: 'plate' },
    ],
    contrasts: [
      {
        withId: 'r-uvular',
        note: "Single tap r (caro) vs the raspy throat r (carro). A double rr or word-initial r is the uvular one; a single r between vowels is the tap.",
        pair: ['caro', 'carro'],
      },
    ],
    audio: '/audio/r-tap.mp3',
  },
  {
    id: 'r-uvular',
    ipa: 'ʁ',
    name: 'Voiced uvular fricative',
    type: 'consonant',
    manner: 'fricative',
    place: 'uvular',
    voiced: true,
    englishAnchor: "a raspy r made in the back of the throat, like a French 'r' or a soft gargle",
    howTo: 'Pull the back of the tongue toward the uvula and let voiced air rasp through — a gargly, throaty r. Used for rr and for r at the start of a word.',
    mnemonic: "The throaty r of 'Rua' and 'carro' — gargle it.",
    examples: [
      { word: 'carro', highlight: 'rr', gloss: 'car' },
      { word: 'rua', highlight: 'r', gloss: 'street' },
      { word: 'rato', highlight: 'r', gloss: 'mouse' },
    ],
    contrasts: [
      {
        withId: 'r-tap',
        note: "Throaty uvular r (carro) vs the single flicked tap (caro). This minimal pair is the classic EP r lesson.",
        pair: ['carro', 'caro'],
      },
    ],
    signatureEP: true,
    audio: '/audio/r-uvular.mp3',
  },
]

/** Lookup map from phoneme id to its Phoneme object. */
export const PHONEMES_BY_ID: Record<string, Phoneme> = Object.fromEntries(
  PHONEMES.map((phoneme) => [phoneme.id, phoneme]),
)

/** Look up a single phoneme by its stable id. */
export function getPhoneme(id: string): Phoneme | undefined {
  return PHONEMES_BY_ID[id]
}
