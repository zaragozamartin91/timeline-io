import { describe, it, expect } from 'vitest';
import * as tok from './tokenize.js';


const tokenizer = new tok.Tokenizer();

describe('Tokenizer', () => {
  describe('token', () => {
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
      const src0 = '$fill="Macro value"'
      const src1 = '$fill  =  "Macro value"'
      const srcs = [src0, src1]

      srcs.forEach(src => {
        const match = tokenizer.token({src, tokenType: tok.TokenType.MACRO_DEFINITION, pos: 0});

        expect(match).toBeTruthy()
        expect(match?.value).toEqual(src)
        expect(match?.content).toEqual(['fill', 'Macro value'])
        expect(match?.lastIndex).toEqual(src.length)
      })
    })

    it('matches a little box message', () => {
      const src0 = '["Box message"]'
      const src1 = '[  "Box message"    ]'
      const srcs = [src0, src1]

      srcs.forEach(src => {
        const match = tokenizer.token({src, tokenType: tok.TokenType.LITTLE_BOX, pos: 0});

        expect(match).toBeTruthy()
        expect(match?.value).toEqual(src)
        expect(match?.content).toEqual(['Box message'])
        expect(match?.lastIndex).toEqual(src.length)
      })
    })

    it('matches a comment with no capture groups', () => {
      const src0 = '# Comment message'
      const src1 = '#'
      const srcs = [src0, src1]

      srcs.forEach(src => {
        const match = tokenizer.token({src, tokenType: tok.TokenType.COMMENT, pos: 0});

        expect(match).toBeTruthy()
        expect(match?.value).toEqual(src)
        expect(match?.content).toEqual([])
        expect(match?.lastIndex).toEqual(src.length)
      })
    })

    it('stops a comment at the end of its line', () => {
      const match = tokenizer.token({src: '# note\nX', tokenType: tok.TokenType.COMMENT, pos: 0});

      expect(match?.value).toEqual('# note')
      expect(match?.lastIndex).toEqual('# note'.length)
    })

    it('matches a timeline extension with no capture groups', () => {
      const src = '|'

      const match = tokenizer.token({src, tokenType: tok.TokenType.TIMELINE_EXTENSION, pos: 0});

      expect(match).toBeTruthy()
      expect(match?.value).toEqual(src)
      expect(match?.content).toEqual([])
      expect(match?.lastIndex).toEqual(src.length)
    })

    it('matches a statement end with no capture groups', () => {
      const src = ';'

      const match = tokenizer.token({src, tokenType: tok.TokenType.STATEMENT_END, pos: 0});

      expect(match).toBeTruthy()
      expect(match?.value).toEqual(src)
      expect(match?.content).toEqual([])
      expect(match?.lastIndex).toEqual(src.length)
    })

    it('matches right and left arrows of 1 to 4 hyphens', () => {
      const srcs = ['->', '-->', '--->', '---->', '<-', '<--', '<---', '<----']

      srcs.forEach(src => {
        const match = tokenizer.token({src, tokenType: tok.TokenType.ARROW, pos: 0});

        expect(match).toBeTruthy()
        expect(match?.value).toEqual(src)
        expect(match?.content).toEqual([])
        expect(match?.lastIndex).toEqual(src.length)
      })
    })

    it('does not match an arrow with more than 4 hyphens', () => {
      expect(tokenizer.token({src: '----->', tokenType: tok.TokenType.ARROW, pos: 0})).toBeNull()

      // The 4-hyphen cap stops the match early: the fifth hyphen is left unconsumed.
      const match = tokenizer.token({src: '<----->', tokenType: tok.TokenType.ARROW, pos: 0});
      expect(match?.value).toEqual('<----')
      expect(match?.lastIndex).toEqual(5)
    })

    it('tokenizes a timeline start declaration as TIMELINE_START', () => {
      const [first] = tok.tokenize('@("Timeline start")').tokens
      expect(first.type).toBe(tok.TokenType.TIMELINE_START)
      expect(first.content).toEqual(['Timeline start'])
    })
  })
})
