import { describe, it, expect } from 'vitest';
import { tokenize, Token, TokenType } from './tokenize.js';

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
    it('matches a quoted string with the sticky regex', () => {
      const re = /"([^"\n]*)"/y
      re.lastIndex = 0
      const src = '"Hello world"'
      const match = re.exec(src);

      expect(match).toBeTruthy()
      expect(match[0]).toEqual('"Hello world"')
      expect(match[1]).toEqual('Hello world')
      expect(re.lastIndex).toEqual(src.length)
    })

    it('matches a top arrow message declaration', () => {
      const re = /\^\(\s*"([^"\n]*)"\s*\)/y
      const src0 = '^("Hello world")'
      const src1 = '^(  "Hello world"    )'
      const srcs = [src0, src1]
      
      srcs.forEach(src => {
        re.lastIndex = 0
        const match = re.exec(src);

        expect(match).toBeTruthy()
        expect(match[0]).toEqual(src)
        expect(match[1]).toEqual('Hello world')
        expect(re.lastIndex).toEqual(src.length)
      })
    })

    it('matches a bottom arrow message declaration', () => {
      const re = /\_\(\s*"([^"\n]*)"\s*\)/y
      const src0 = '_("Hello world")'
      const src1 = '_(  "Hello world"    )'
      const srcs = [src0, src1]
      
      srcs.forEach(src => {
        re.lastIndex = 0
        const match = re.exec(src);

        expect(match).toBeTruthy()
        expect(match[0]).toEqual(src)
        expect(match[1]).toEqual('Hello world')
        expect(re.lastIndex).toEqual(src.length)
      })
    })
  })
})

