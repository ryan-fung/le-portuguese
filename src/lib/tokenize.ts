/**
 * Lightweight tokenizer for the Reader. Splits arbitrary pasted text into an
 * ordered list of tokens, each tagged as a pronounceable `word` or as
 * `other` (whitespace, punctuation, digits, symbols). Only `word` tokens get
 * run through the G2P engine; everything else is rendered verbatim so the
 * original text — line breaks, punctuation, numbers — is preserved exactly.
 */

export type TokenKind = 'word' | 'other'

export interface Token {
  kind: TokenKind
  /** The literal text of this token. */
  text: string
}

/**
 * A "word" is a run of letters, optionally stitched together by a single
 * internal hyphen or apostrophe (e.g. `bom-dia`, `d'água`). Accented Latin
 * letters are included. Everything else — spaces, newlines, punctuation,
 * digits — is grouped into `other` tokens, with whitespace kept separate from
 * punctuation so rendering can treat them differently.
 */
const WORD_RE = /[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’-][A-Za-zÀ-ÖØ-öø-ÿ]+)*/gu

export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  if (!input) return tokens

  let lastIndex = 0
  for (const match of input.matchAll(WORD_RE)) {
    const start = match.index ?? 0
    if (start > lastIndex) {
      pushOther(tokens, input.slice(lastIndex, start))
    }
    tokens.push({ kind: 'word', text: match[0] })
    lastIndex = start + match[0].length
  }
  if (lastIndex < input.length) {
    pushOther(tokens, input.slice(lastIndex))
  }
  return tokens
}

/**
 * Split a non-word run so that whitespace (which should allow line wrapping
 * and preserve newlines) stays separate from punctuation/symbols.
 */
function pushOther(tokens: Token[], text: string): void {
  const parts = text.match(/\s+|\S+/g)
  if (!parts) return
  for (const part of parts) {
    tokens.push({ kind: 'other', text: part })
  }
}

/** True when an `other` token is purely whitespace. */
export function isWhitespace(text: string): boolean {
  return /^\s+$/.test(text)
}

/** True when an `other` token contains a newline (forces a line break). */
export function hasNewline(text: string): boolean {
  return /\n/.test(text)
}
