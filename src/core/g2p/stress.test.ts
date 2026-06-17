import { describe, it, expect } from 'vitest'
import { assignStress } from './stress'
import { syllabify } from './syllabify'

/** Convenience: syllabify then assign stress in one step. */
function stressOf(word: string): number {
  return assignStress(syllabify(word), word)
}

describe('assignStress — accent mark wins', () => {
  it('marks the accented syllable regardless of ending', () => {
    expect(stressOf('água')).toBe(0) // á-gua
    expect(stressOf('café')).toBe(1) // ca-FÉ
    expect(stressOf('coração')).toBe(2) // co-ra-ÇÃO (tilde counts)
    expect(stressOf('árvore')).toBe(0) // ÁR-vo-re
  })

  it('treats the tilde as a stress-bearing accent', () => {
    expect(stressOf('órgão')).toBe(0) // ÓR-gão (first accent wins)
  })
})

describe('assignStress — oxytone endings', () => {
  it('stresses the last syllable for l/r/z/x/i/u finals', () => {
    expect(stressOf('animal')).toBe(2) // a-ni-MAL
    expect(stressOf('falar')).toBe(1) // fa-LAR
    expect(stressOf('feliz')).toBe(1) // fe-LIZ
    expect(stressOf('aqui')).toBe(1) // a-QUI
  })

  it('stresses the last syllable for im/um/ins/uns finals', () => {
    expect(stressOf('jardim')).toBe(1) // jar-DIM
    expect(stressOf('comum')).toBe(1) // co-MUM
  })
})

describe('assignStress — default paroxytone', () => {
  it('stresses the penultimate for vowel and -m/-s endings', () => {
    expect(stressOf('chamava')).toBe(1) // cha-MA-va
    expect(stressOf('telefone')).toBe(2) // te-le-FO-ne
    expect(stressOf('livros')).toBe(0) // LI-vros
    expect(stressOf('homem')).toBe(0) // HO-mem
  })
})

describe('assignStress — monosyllables', () => {
  it('always returns index 0', () => {
    expect(stressOf('sol')).toBe(0)
    expect(stressOf('mãe')).toBe(0)
    expect(stressOf('não')).toBe(0)
  })
})
