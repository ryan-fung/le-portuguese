import { describe, it, expect } from 'vitest'
import { PHONEMES, PHONEMES_BY_ID, getPhoneme } from './phonemes'
import { PHONEME_IDS, VALID_PHONEME_IDS } from '@/core/phoneme-ids'

describe('PHONEMES inventory', () => {
  it('has exactly one Phoneme per registry id (no missing, no orphans)', () => {
    const inventoryIds = PHONEMES.map((p) => p.id).sort()
    const registryIds = Object.keys(PHONEME_IDS).sort()

    expect(inventoryIds).toEqual(registryIds)
    expect(PHONEMES).toHaveLength(registryIds.length)

    // No duplicate ids in the inventory.
    expect(new Set(inventoryIds).size).toBe(PHONEMES.length)
  })

  it('covers every registry id and emits no unknown ids', () => {
    for (const id of Object.keys(PHONEME_IDS)) {
      expect(PHONEMES_BY_ID[id], `missing phoneme for id "${id}"`).toBeDefined()
    }
    for (const phoneme of PHONEMES) {
      expect(VALID_PHONEME_IDS.has(phoneme.id), `unknown id "${phoneme.id}"`).toBe(true)
    }
  })

  it('matches the registry id, ipa, and type for every phoneme', () => {
    for (const phoneme of PHONEMES) {
      const entry = PHONEME_IDS[phoneme.id as keyof typeof PHONEME_IDS]
      expect(entry, `no registry entry for "${phoneme.id}"`).toBeDefined()
      expect(phoneme.id).toBe(entry.id)
      expect(phoneme.ipa).toBe(entry.ipa)
      expect(phoneme.type).toBe(entry.type)
    }
  })

  it('mirrors the registry signatureEP flag', () => {
    for (const phoneme of PHONEMES) {
      const entry = PHONEME_IDS[phoneme.id as keyof typeof PHONEME_IDS]
      const expected = 'signatureEP' in entry && entry.signatureEP === true
      expect(Boolean(phoneme.signatureEP), `signatureEP mismatch for "${phoneme.id}"`).toBe(expected)
    }
  })

  it('has non-empty required teaching fields', () => {
    for (const phoneme of PHONEMES) {
      expect(phoneme.name.trim().length, `name for "${phoneme.id}"`).toBeGreaterThan(0)
      expect(phoneme.englishAnchor.trim().length, `englishAnchor for "${phoneme.id}"`).toBeGreaterThan(0)
      expect(phoneme.howTo.trim().length, `howTo for "${phoneme.id}"`).toBeGreaterThan(0)
    }
  })

  it('has at least one well-formed example per phoneme', () => {
    for (const phoneme of PHONEMES) {
      expect(phoneme.examples.length, `examples for "${phoneme.id}"`).toBeGreaterThanOrEqual(1)
      for (const example of phoneme.examples) {
        expect(example.word.trim().length, `example word for "${phoneme.id}"`).toBeGreaterThan(0)
      }
    }
  })

  it('sets the audio path from the id for every phoneme', () => {
    for (const phoneme of PHONEMES) {
      expect(phoneme.audio).toBe(`/audio/${phoneme.id}.mp3`)
    }
  })

  it('references only valid ids in contrasts', () => {
    for (const phoneme of PHONEMES) {
      for (const contrast of phoneme.contrasts ?? []) {
        expect(
          VALID_PHONEME_IDS.has(contrast.withId),
          `contrast on "${phoneme.id}" references unknown id "${contrast.withId}"`,
        ).toBe(true)
        expect(contrast.withId, `self-contrast on "${phoneme.id}"`).not.toBe(phoneme.id)
        expect(contrast.note.trim().length, `contrast note on "${phoneme.id}"`).toBeGreaterThan(0)
      }
    }
  })

  it('exposes a working lookup helper', () => {
    expect(getPhoneme('sh')).toBe(PHONEMES_BY_ID.sh)
    expect(getPhoneme('a-central')?.ipa).toBe('ɐ')
    expect(getPhoneme('does-not-exist')).toBeUndefined()
  })
})
