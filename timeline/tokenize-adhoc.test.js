import { describe, it, expect } from 'vitest';
import { tokenize, Token, TokenType, Regex, Tokenizer } from './tokenize.js';


const tokenizer = new Tokenizer();

describe('tokenize', () => {
  describe('group re', () => {
    it('matches a top arrow message declaration', () => {
      const src0 = '^("Top message")'
      const src1 = '^(  "Top message"    )'
      const srcs = [src0, src1]

      srcs.forEach(src => {
        const match = tokenizer.token({src, tokenType: TokenType.ARROW_TOP_MESSAGE, pos: 0});

        expect(match).toBeTruthy()
        expect(match?.value).toEqual(src)
        expect(match?.content).toEqual('Top message')
        expect(match?.lastIndex).toEqual(src.length)
      })
    })

    it('matches a bottom arrow message declaration', () => {
      const src0 = '_("Bottom message")'
      const src1 = '_(  "Bottom message"    )'
      const srcs = [src0, src1]

      srcs.forEach(src => {
        const match = tokenizer.token({src, tokenType: TokenType.ARROW_BOTTOM_MESSAGE, pos: 0});

        expect(match).toBeTruthy()
        expect(match?.value).toEqual(src)
        expect(match?.content).toEqual('Bottom message')
        expect(match?.lastIndex).toEqual(src.length)
      })
    })

    it('matches a timeline start declaration', () => {
      const src0 = '@("Timeline start")'
      const src1 = '@(  "Timeline start"    )'
      const srcs = [src0, src1]

      srcs.forEach(src => {
        const match = tokenizer.token({src, tokenType: TokenType.TIMELINE_START, pos: 0});

        expect(match).toBeTruthy()
        expect(match?.value).toEqual(src)
        expect(match?.content).toEqual('Timeline start')
        expect(match?.lastIndex).toEqual(src.length)
      })
    })

    it('tokenizes a timeline start declaration as TIMELINE_START', () => {
      const [first] = tokenize('@("Timeline start")')
      expect(first.type).toBe(TokenType.TIMELINE_START)
      expect(first.content).toEqual('Timeline start')
    })
  })
})
