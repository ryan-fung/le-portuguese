import { describe, it, expect } from 'vitest'
import { analyze } from './portuguese'
import { isPhonemeId } from '@/core/phoneme-ids'

/** All emitted phoneme ids for a word, in order. */
function ids(word: string): string[] {
  return analyze(word)
    .segments.filter((s) => s.phonemeId)
    .map((s) => s.phonemeId as string)
}

describe('analyze — every emitted phoneme id is in the registry', () => {
  const words = [
    'chamar', 'exame', 'peixe', 'coração', 'mãe', 'põe', 'não', 'falar',
    'Lisboa', 'pequeno', 'telefone', 'doente', 'cisne', 'mesmo', 'livros',
    'animal', 'carro', 'caro', 'senhor', 'melhor', 'vinho', 'água', 'quente',
    'guerra', 'sol', 'mil', 'casa', 'massa', 'rua', 'campo', 'bem', 'sim',
  ]
  it.each(words)('%s emits only valid ids', (word) => {
    for (const id of ids(word)) expect(isPhonemeId(id)).toBe(true)
  })
})

describe('analyze — vowel reduction (the signature EP feature)', () => {
  it('reduces unstressed a → ɐ, keeps stressed a → a', () => {
    // cha-MAR: unstressed a is ɐ, stressed a is open a.
    expect(analyze('chamar').ipa).toBe('ʃɐˈmaɾ')
    expect(ids('chamar')).toEqual(['sh', 'a-central', 'm', 'a-open', 'r-tap'])
  })

  it('reduces unstressed e → ɨ (the ghost vowel)', () => {
    expect(analyze('pequeno').ipa).toBe('pɨˈkenu')
    expect(ids('telefone')).toEqual([
      't', 'e-central', 'l', 'e-central', 'f', 'o-close', 'n', 'e-central',
    ])
  })

  it('reduces unstressed o → u', () => {
    expect(analyze('telefone').ipa).toBe('tɨlɨˈfonɨ')
    expect(analyze('mesmo').ipa).toBe('ˈmeʒmu')
  })

  it('turns stressed a → ɐ before a nasal consonant', () => {
    // exame: the stressed a is central because of the following m.
    expect(analyze('exame').ipa).toBe('ɨˈzɐmɨ')
  })
})

describe('analyze — sibilant position rules', () => {
  it('uses ʃ for a voiceless / word-final coda s', () => {
    expect(analyze('livros').ipa).toBe('ˈlivɾuʃ')
  })

  it('uses ʒ for a coda s before a voiced consonant', () => {
    expect(analyze('Lisboa').ipa).toBe('liʒˈboɐ')
    expect(analyze('cisne').ipa).toBe('ˈsiʒnɨ')
    expect(analyze('mesmo').ipa).toBe('ˈmeʒmu')
  })

  it('voices a single intervocalic s → z', () => {
    expect(analyze('casa').ipa).toBe('ˈkazɐ')
  })

  it('keeps ss → s', () => {
    expect(analyze('massa').ipa).toBe('ˈmasɐ')
    expect(ids('massa')).toEqual(['m', 'a-open', 's', 'a-central'])
  })
})

describe('analyze — the r contrast', () => {
  it('uses the uvular ʁ for rr and word-initial r', () => {
    expect(analyze('carro').ipa).toBe('ˈkaʁu')
    expect(analyze('rua').ipa).toBe('ˈʁuɐ')
    expect(analyze('guerra').ipa).toBe('ˈɡeʁɐ')
  })

  it('uses the tap ɾ for a single intervocalic / coda r', () => {
    expect(analyze('caro').ipa).toBe('ˈkaɾu')
    expect(analyze('falar').ipa).toBe('fɐˈlaɾ')
  })

  it('contrasts caro (tap) with carro (uvular)', () => {
    expect(ids('caro')).toContain('r-tap')
    expect(ids('carro')).toContain('r-uvular')
  })
})

describe('analyze — dark coda l vs clear onset l', () => {
  it('darkens a syllable-final l', () => {
    expect(analyze('animal').ipa).toBe('ɐniˈmaɫ')
    expect(analyze('sol').ipa).toBe('soɫ')
    expect(analyze('mil').ipa).toBe('miɫ')
  })

  it('keeps an onset l clear', () => {
    expect(ids('falar')).toContain('l')
    expect(ids('falar')).not.toContain('l-dark')
  })
})

describe('analyze — digraphs', () => {
  it('maps ch → ʃ, nh → ɲ, lh → ʎ', () => {
    expect(analyze('chamar').ipa).toBe('ʃɐˈmaɾ')
    expect(analyze('vinho').ipa).toBe('ˈviɲu')
    expect(analyze('senhor').ipa).toBe('sɨˈɲoɾ')
    expect(analyze('melhor').ipa).toBe('mɨˈʎoɾ')
  })

  it('handles qu/gu before e/i with a silent u', () => {
    expect(analyze('quente').ipa).toBe('ˈkẽtɨ')
    expect(analyze('guerra').ipa).toBe('ˈɡeʁɐ')
    const u = analyze('quente').segments.find((s) => s.grapheme === 'u')
    expect(u?.silent).toBe(true)
  })

  it('handles gu/qu before a with a w-glide', () => {
    expect(analyze('água').ipa).toBe('ˈaɡwɐ')
    expect(ids('água')).toContain('w-glide')
  })
})

describe('analyze — nasalization', () => {
  it('nasalizes a vowel before a coda m/n and absorbs the nasal', () => {
    expect(analyze('campo').ipa).toBe('ˈkɐ̃pu')
    expect(analyze('doente').ipa).toBe('duˈẽtɨ')
    expect(analyze('quente').ipa).toBe('ˈkẽtɨ')
    expect(analyze('sim').ipa).toBe('sĩ')
    // The absorbed m/n is marked silent.
    const m = analyze('campo').segments.find((s) => s.grapheme === 'm')
    expect(m?.silent).toBe(true)
  })

  it('produces the nasal diphthongs ão / ãe / õe', () => {
    expect(analyze('não').ipa).toBe('nɐ̃w̃')
    expect(analyze('coração').ipa).toBe('kuɾɐˈsɐ̃w̃')
    expect(analyze('mãe').ipa).toBe('mɐ̃j̃')
    expect(analyze('põe').ipa).toBe('põj̃')
  })

  it('diphthongizes word-final -em → ɐ̃j̃', () => {
    expect(analyze('bem').ipa).toBe('bɐ̃j̃')
  })
})

describe('analyze — accent marks set vowel quality', () => {
  it('reads é/ê/ó/ô/á/â', () => {
    expect(ids('café')).toContain('e-open')
    expect(ids('avô')).toContain('o-close')
    expect(ids('avó')).toContain('o-open')
    expect(ids('água')).toContain('a-open')
  })
})

describe('analyze — the EP ei → ɐj shift and ou monophthong', () => {
  it('renders ei as ɐj', () => {
    expect(analyze('peixe').ipa).toBe('ˈpɐjʃɨ')
    expect(ids('peixe')).toEqual(['p', 'a-central', 'j-glide', 'sh', 'e-central'])
  })

  it('monophthongizes ou → o', () => {
    // "ouro" → ˈoru: the ou is a single close o.
    expect(ids('ouro')).toContain('o-close')
    expect(ids('ouro')).not.toContain('w-glide')
  })
})

describe('analyze — x heuristics', () => {
  it('reads word-initial ex + vowel as [z]', () => {
    expect(analyze('exame').ipa).toBe('ɨˈzɐmɨ')
    expect(ids('exame')).toContain('z')
  })

  it('defaults x to ʃ', () => {
    expect(ids('peixe')).toContain('sh')
  })
})

describe('analyze — structure, stress index, and respelling', () => {
  it('reports the stressed syllable index', () => {
    expect(analyze('chamar').stressIndex).toBe(1)
    expect(analyze('telefone').stressIndex).toBe(2)
    expect(analyze('água').stressIndex).toBe(0)
  })

  it('reports -1 for monosyllables but still stresses them phonetically', () => {
    const a = analyze('sol')
    expect(a.stressIndex).toBe(-1)
    expect(a.syllables[0].stressed).toBe(true)
  })

  it('upper-cases the stressed syllable in the respelling', () => {
    expect(analyze('chamar').respelling).toBe('shuh-MAHR')
    expect(analyze('telefone').respelling).toBe('tuh-luh-FOH-nuh')
    expect(analyze('peixe').respelling).toBe('PUHY-shuh')
  })

  it('groups segments into syllables matching the orthographic split', () => {
    const syls = analyze('telefone').syllables
    expect(syls).toHaveLength(4)
    expect(syls.map((s) => s.stressed)).toEqual([false, false, true, false])
  })

  it('keeps the original input verbatim', () => {
    expect(analyze('Lisboa').input).toBe('Lisboa')
  })

  it('handles empty input gracefully', () => {
    const a = analyze('')
    expect(a.segments).toEqual([])
    expect(a.stressIndex).toBe(-1)
    expect(a.ipa).toBe('')
  })
})
