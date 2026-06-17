import { describe, it, expect } from 'vitest'
import { syllabify } from './syllabify'

describe('syllabify — basic CV splitting', () => {
  it('splits simple alternating words', () => {
    expect(syllabify('chamar')).toEqual(['cha', 'mar'])
    expect(syllabify('sapo')).toEqual(['sa', 'po'])
    expect(syllabify('banana')).toEqual(['ba', 'na', 'na'])
  })

  it('keeps a single intervocalic consonant with the following syllable', () => {
    expect(syllabify('caro')).toEqual(['ca', 'ro'])
    expect(syllabify('telefone')).toEqual(['te', 'le', 'fo', 'ne'])
  })
})

describe('syllabify — clusters and codas', () => {
  it('splits a geminate / coda+onset cluster', () => {
    expect(syllabify('carro')).toEqual(['car', 'ro'])
    expect(syllabify('cisne')).toEqual(['cis', 'ne'])
    expect(syllabify('mesmo')).toEqual(['mes', 'mo'])
  })

  it('keeps muta-cum-liquida clusters together as an onset', () => {
    expect(syllabify('livros')).toEqual(['li', 'vros'])
    expect(syllabify('prato')).toEqual(['pra', 'to'])
  })
})

describe('syllabify — digraphs', () => {
  it('never splits ch/lh/nh', () => {
    expect(syllabify('senhor')).toEqual(['se', 'nhor'])
    expect(syllabify('melhor')).toEqual(['me', 'lhor'])
    expect(syllabify('vinho')).toEqual(['vi', 'nho'])
  })

  it('keeps qu/gu clusters together', () => {
    expect(syllabify('quente')).toEqual(['quen', 'te'])
    expect(syllabify('guerra')).toEqual(['guer', 'ra'])
    expect(syllabify('água')).toEqual(['á', 'gua'])
  })
})

describe('syllabify — diphthongs and hiatus', () => {
  it('keeps falling diphthongs together', () => {
    expect(syllabify('peixe')).toEqual(['pei', 'xe'])
    expect(syllabify('não')).toEqual(['não'])
    expect(syllabify('mãe')).toEqual(['mãe'])
  })

  it('splits a vowel hiatus', () => {
    expect(syllabify('Lisboa')).toEqual(['lis', 'bo', 'a'])
    expect(syllabify('doente')).toEqual(['do', 'en', 'te'])
  })
})

describe('syllabify — edge cases', () => {
  it('returns a single syllable for monosyllables', () => {
    expect(syllabify('sol')).toEqual(['sol'])
    expect(syllabify('mil')).toEqual(['mil'])
    expect(syllabify('tu')).toEqual(['tu'])
  })

  it('handles empty input', () => {
    expect(syllabify('')).toEqual([])
  })
})
