import { describe, it, expect } from 'vitest';
import { tokenize, Token, TokenType, Regex } from './tokenize.js';

/**
 * Returns only the token types produced for `src`, in order.
 *
 * @param {string} src Source text to tokenize
 * @returns {symbol[]} Token types, including the trailing EOF
 */
function types(src) {
  return tokenize(src).map((t) => t.type);
}

/**
 * Returns the `[type, value]` pairs produced for `src`, in order.
 *
 * @param {string} src Source text to tokenize
 * @returns {Array<[symbol, string]>} Pairs of token type and token value
 */
function pairs(src) {
  return tokenize(src).map((t) => [t.type, t.value]);
}

describe('tokenize', () => {
  describe('group re', () => {
    it('matches a top arrow message declaration', () => {
      const re = Regex[TokenType.ARROW_TOP_MESSAGE]
      const src0 = '^("Top message")'
      const src1 = '^(  "Top message"    )'
      const srcs = [src0, src1]
      
      srcs.forEach(src => {
        re.lastIndex = 0
        const match = re.exec(src);

        expect(match).toBeTruthy()
        expect(match?.[0]).toEqual(src)
        expect(match?.[1]).toEqual('Top message')
        expect(re.lastIndex).toEqual(src.length)
      })
    })

    it('matches a bottom arrow message declaration', () => {
      const re = Regex[TokenType.ARROW_BOTTOM_MESSAGE]
      const src0 = '_("Bottom message")'
      const src1 = '_(  "Bottom message"    )'
      const srcs = [src0, src1]
      
      srcs.forEach(src => {
        re.lastIndex = 0
        const match = re.exec(src);

        expect(match).toBeTruthy()
        expect(match?.[0]).toEqual(src)
        expect(match?.[1]).toEqual('Bottom message')
        expect(re.lastIndex).toEqual(src.length)
      })
    })

    it('matches a timeline start declaration', () => {
      const re = Regex[TokenType.TIMELINE_START]
      const src0 = '@("Timeline start")'
      const src1 = '@(  "Timeline start"    )'
      const srcs = [src0, src1]

      srcs.forEach(src => {
        re.lastIndex = 0
        const match = re.exec(src);

        expect(match).toBeTruthy()
        expect(match?.[0]).toEqual(src)
        expect(match?.[1]).toEqual('Timeline start')
        expect(re.lastIndex).toEqual(src.length)
      })
    })

    it('tokenizes a timeline start declaration as TIMELINE_START', () => {
      const [first] = tokenize('@("Timeline start")')
      expect(first.type).toBe(TokenType.TIMELINE_START)
      expect(first.content).toEqual('Timeline start')
    })
  })
})

