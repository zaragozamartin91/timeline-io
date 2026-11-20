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

  describe('lexicon', () => {
    it('tokenizes the quoted DSL source into successful, correct tokens', () => {
      const src = `# Comments are single lined and defined using Hash

# Statements end with semi-colon
# This is an empty statement
;

# Starting point statement
@("2026-10-30");

# right arrow statement
->;

# left arrow statement
<-;

# long right arrow statement
-->;

# longer right arrow statement
--->;

# longest right arrow statement
---->;

# the semi-colon can be placed far away from the dsl body
<---   ;

# timeline extend statement
| ;

# Meta / macro statement start with $
# The example below changes the fill color of the svg shapes to brown.
$fill="brown";

# right arrow with message on top
# ^("<some message>") defines the top message to place on the arrow.
->^("top message");

# right arrow with message on bottom
# _("<some message>") defines the bottom message to place on the arrow.
->_("bottom message");

# right arrow with both message on top and on the bottom
->^("another top message")_("one more bottom message");

# Long arrow pointing to a box
# ["<some text>"] defines a box to which the arrow points to
-->["this is a box"];
`;

      const T = tok.TokenType;
      const lexicon = tokenizer.lexicon({ src });

      expect(lexicon.success()).toBe(true);
      expect(lexicon.failed()).toBe(false);

      // Whitespace is not significant here; compare the meaningful tokens in order.
      const tokens = lexicon.tokens.filter((t) => t.type !== T.WS);

      const expectedTypes = [
        T.COMMENT, T.COMMENT, T.COMMENT, T.STATEMENT_END,           // comments, empty statement
        T.COMMENT, T.TIMELINE_START, T.STATEMENT_END,               // @("2026-10-30");
        T.COMMENT, T.ARROW, T.STATEMENT_END,                        // ->;
        T.COMMENT, T.ARROW, T.STATEMENT_END,                        // <-;
        T.COMMENT, T.ARROW, T.STATEMENT_END,                        // -->;
        T.COMMENT, T.ARROW, T.STATEMENT_END,                        // --->;
        T.COMMENT, T.ARROW, T.STATEMENT_END,                        // ---->;
        T.COMMENT, T.ARROW, T.STATEMENT_END,                        // <---   ;
        T.COMMENT, T.TIMELINE_EXTENSION, T.STATEMENT_END,           // | ;
        T.COMMENT, T.COMMENT, T.MACRO_DEFINITION, T.STATEMENT_END,  // $fill="brown";
        T.COMMENT, T.COMMENT, T.ARROW, T.ARROW_TOP_MESSAGE, T.STATEMENT_END,
        T.COMMENT, T.COMMENT, T.ARROW, T.ARROW_BOTTOM_MESSAGE, T.STATEMENT_END,
        T.COMMENT, T.ARROW, T.ARROW_TOP_MESSAGE, T.ARROW_BOTTOM_MESSAGE, T.STATEMENT_END,
        T.COMMENT, T.COMMENT, T.ARROW, T.LITTLE_BOX, T.STATEMENT_END,
        T.EOF,
      ];
      expect(tokens.map((t) => t.type)).toEqual(expectedTypes);

      // Each token's value is exactly the source slice it claims to cover.
      tokens.forEach((t) => {
        expect(src.slice(t.pos, t.lastIndex)).toBe(t.value);
      });

      // Capture groups for the tokens that carry quoted text or macro parts.
      const tokensWithContent = tokens.filter((t) => t.bearsContent()).map((t) => t.content);
      expect(tokensWithContent).toEqual([
        ['2026-10-30'],
        ['fill', 'brown'],
        ['top message'],
        ['bottom message'],
        ['another top message'],
        ['one more bottom message'],
        ['this is a box'],
      ]);
    })

    it('fails on a syntax error and reports the ERROR token on the faulty line', () => {
      const src = `@("2026-10-30");

  |

$fill="red";

->^("top message");

<--x("Faulty arrow")

->_("bottom message");

# right arrow with both message on top and on the bottom
->^("another top message")_("one more bottom message");
`;

      const T = tok.TokenType;
      const lexicon = tokenizer.lexicon({ src });

      expect(lexicon.failed()).toBe(true);
      expect(lexicon.success()).toBe(false);

      const errors = lexicon.errorTokens();
      expect(errors).toHaveLength(1);

      // The ERROR token sits on the faulty line, at the first character no rule matched (the 'x').
      const errorPos = errors[0].pos;
      const faultyLine = '<--x("Faulty arrow")';
      const lineStart = src.lastIndexOf('\n', errorPos - 1) + 1;
      const lineEnd = src.indexOf('\n', errorPos);
      expect(src.slice(lineStart, lineEnd)).toBe(faultyLine);
      expect(errorPos).toBe(src.indexOf(faultyLine) + '<--'.length);

      // Lexing halts at the fault: only EOF follows the ERROR token.
      const nonWs = lexicon.tokens.filter((t) => t.type !== T.WS);
      expect(nonWs.slice(-2).map((t) => t.type)).toEqual([T.ERROR, T.EOF]);
    })

    it('returns only EOF for empty input', () => {
      const lexicon = tokenizer.lexicon({ src: '' });

      expect(lexicon.success()).toBe(true);
      expect(lexicon.tokens.map((t) => t.type)).toEqual([tok.TokenType.EOF]);
      expect(lexicon.tokens[0].value).toEqual('');
      expect(lexicon.tokens[0].pos).toEqual(0);
    })
  })
})
