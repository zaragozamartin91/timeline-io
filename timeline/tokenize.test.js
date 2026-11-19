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
  describe('basics', () => {
    it('returns only EOF for empty input', () => {
      expect(tokenize('')).toEqual([Token.of(TokenType.EOF, '', 0)]);
    });

    it('always ends with EOF positioned at end of source', () => {
      const src = 'fill a';
      const tokens = tokenize(src);
      const last = tokens[tokens.length - 1];
      expect(last).toEqual(Token.of(TokenType.EOF, '', src.length));
    });

    it('returns Token instances', () => {
      for (const token of tokenize('fill a')) {
        expect(token).toBeInstanceOf(Token);
      }
    });

    it('skips spaces, tabs and newlines', () => {
      expect(types(' \t\n  \r\n ')).toEqual([TokenType.EOF]);
      expect(types('a \t\n b')).toEqual([TokenType.IDENT, TokenType.IDENT, TokenType.EOF]);
    });
  });

  describe('comments', () => {
    it('skips a comment running to end of line', () => {
      expect(types('# nothing here')).toEqual([TokenType.EOF]);
    });

    it('resumes tokenizing on the line after a comment', () => {
      expect(pairs('a # note\nb')).toEqual([
        [TokenType.IDENT, 'a'],
        [TokenType.IDENT, 'b'],
        [TokenType.EOF, ''],
      ]);
    });

    it('does not treat # inside a string as a comment', () => {
      expect(pairs('"#not a comment"')).toEqual([
        [TokenType.STRING, '"#not a comment"'],
        [TokenType.EOF, ''],
      ]);
    });
  });

  describe('STRING', () => {
    it('keeps the surrounding quotes in the value', () => {
      expect(pairs('"hello world"')).toEqual([
        [TokenType.STRING, '"hello world"'],
        [TokenType.EOF, ''],
      ]);
    });

    it('accepts an empty string', () => {
      expect(pairs('""')).toEqual([
        [TokenType.STRING, '""'],
        [TokenType.EOF, ''],
      ]);
    });

    it('throws on an unterminated string', () => {
      expect(() => tokenize('"abc')).toThrow(SyntaxError);
    });

    it('throws on a string spanning a newline', () => {
      expect(() => tokenize('"a\nb"')).toThrow(SyntaxError);
    });
  });

  describe('ARROW', () => {
    it.each(['->', '-->', '--->', '<-', '<---'])(
      'tokenizes %s as a single ARROW',
      (arrow) => {
        expect(pairs(arrow)).toEqual([
          [TokenType.ARROW, arrow],
          [TokenType.EOF, ''],
        ]);
      },
    );

    it('throws on a lone dash', () => {
      expect(() => tokenize('-')).toThrow(SyntaxError);
    });

    it('throws on a lone greater-than sign', () => {
      expect(() => tokenize('>')).toThrow(SyntaxError);
    });
  });

  describe('PUNCT', () => {
    it.each([';', '(', ')', '[', ']', '=', '|', '^', '_', '@', '$'])(
      'tokenizes %s as a single PUNCT',
      (ch) => {
        expect(pairs(ch)).toEqual([
          [TokenType.PUNCT, ch],
          [TokenType.EOF, ''],
        ]);
      },
    );

    it('keeps underscores inside an identifier as part of IDENT', () => {
      expect(pairs('a_b')).toEqual([
        [TokenType.IDENT, 'a_b'],
        [TokenType.EOF, ''],
      ]);
    });
  });

  describe('IDENT', () => {
    it('tokenizes a plain word', () => {
      expect(pairs('fill')).toEqual([
        [TokenType.IDENT, 'fill'],
        [TokenType.EOF, ''],
      ]);
    });

    it('allows digits after the first letter', () => {
      expect(pairs('a1_b2')).toEqual([
        [TokenType.IDENT, 'a1_b2'],
        [TokenType.EOF, ''],
      ]);
    });

    it('throws when a name starts with a digit', () => {
      expect(() => tokenize('1abc')).toThrow(SyntaxError);
    });
  });

  describe('mixed input', () => {
    it('applies the first matching rule, so a->b is IDENT ARROW IDENT', () => {
      expect(types('a->b')).toEqual([TokenType.IDENT, TokenType.ARROW, TokenType.IDENT, TokenType.EOF]);
    });

    it('records the source position of every token', () => {
      expect(tokenize('a -> "x";')).toEqual([
        Token.of(TokenType.IDENT, 'a', 0),
        Token.of(TokenType.ARROW, '->', 2),
        Token.of(TokenType.STRING, '"x"', 5),
        Token.of(TokenType.PUNCT, ';', 8),
        Token.of(TokenType.EOF, '', 9),
      ]);
    });
  });

  describe('errors', () => {
    it('throws SyntaxError naming the bad character and its position', () => {
      expect(() => tokenize('a !')).toThrow(SyntaxError);
      expect(() => tokenize('a !')).toThrow('Unexpected character "!" at 2');
    });
  });
});
