import { describe, it, expect } from 'vitest';
import * as tok from './tokenize.js';


const tokenizer = new tok.Tokenizer();

describe('tokenize', () => {
  describe('group re', () => {
    it('matches a top arrow message declaration', () => {
      const src0 = '^("Top message")'
      const src1 = '^(  "Top message"    )'
      const srcs = [src0, src1]

      srcs.forEach(src => {
        const match = tokenizer.token({src, tokenType: tok.TokenType.ARROW_TOP_MESSAGE, pos: 0});

        expect(match).toBeTruthy()
        expect(match?.value).toEqual(src)
        expect(match?.content).toEqual(['Top message'])
        expect(match?.lastIndex).toEqual(src.length)
      })
    })

    it('matches a bottom arrow message declaration', () => {
      const src0 = '_("Bottom message")'
      const src1 = '_(  "Bottom message"    )'
      const srcs = [src0, src1]

      srcs.forEach(src => {
        const match = tokenizer.token({src, tokenType: tok.TokenType.ARROW_BOTTOM_MESSAGE, pos: 0});

        expect(match).toBeTruthy()
        expect(match?.value).toEqual(src)
        expect(match?.content).toEqual(['Bottom message'])
        expect(match?.lastIndex).toEqual(src.length)
      })
    })

    it('matches a timeline start declaration', () => {
      const src0 = '@("Timeline start")'
      const src1 = '@(  "Timeline start"    )'
      const srcs = [src0, src1]

      srcs.forEach(src => {
        const match = tokenizer.token({src, tokenType: tok.TokenType.TIMELINE_START, pos: 0});

        expect(match).toBeTruthy()
        expect(match?.value).toEqual(src)
        expect(match?.content).toEqual(['Timeline start'])
        expect(match?.lastIndex).toEqual(src.length)
      })
    })

    it('matches a macro definition with name and value groups', () => {
      const src0 = '$a="Macro value"'
      const src1 = '$a  =  "Macro value"'
      const srcs = [src0, src1]

      srcs.forEach(src => {
        const match = tokenizer.token({src, tokenType: tok.TokenType.MACRO_DEFINITION, pos: 0});

        expect(match).toBeTruthy()
        expect(match?.value).toEqual(src)
        expect(match?.content).toEqual(['a', 'Macro value'])
        expect(match?.lastIndex).toEqual(src.length)
      })
    })

    it('tokenizes a timeline start declaration as TIMELINE_START', () => {
      const [first] = tok.tokenize('@("Timeline start")')
      expect(first.type).toBe(tok.TokenType.TIMELINE_START)
      expect(first.content).toEqual(['Timeline start'])
    })
  })
})
