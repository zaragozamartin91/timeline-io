/**
 * Token type symbols. Each value is a unique symbol.
 * @enum {symbol}
 */
export const TokenType = Object.freeze({
  WS: Symbol('WS'),
  COMMENT: Symbol('COMMENT'),
  STRING: Symbol('STRING'),
  ARROW: Symbol('ARROW'),
  PUNCT: Symbol('PUNCT'),
  IDENT: Symbol('IDENT'),
  EOF: Symbol('EOF'),
});

/**
 * A single lexical token.
 */
export class Token {
  /** @type {TokenType} Kind of token */ type;
  /** @type {string} Matched source text */ value = '';
  /** @type {number} Index of the first character in the source */ pos = 0;

  /**
   * @param {{type: TokenType, value?: string, pos?: number}} params
   */
  constructor({ type, value = '', pos = 0 }) {
    this.type = type;
    this.value = value;
    this.pos = pos;
  }

  /**
   * Build a Token from ordinal arguments.
   * @param {TokenType} type Kind of token
   * @param {string} value Matched source text
   * @param {number} pos Index of the first character in the source
   * @returns {Token}
   */
  static of(type, value, pos) {
    return new Token({ type, value, pos });
  }
}

/// The y flag makes the regex sticky. With re.lastIndex set, exec only matches starting exactly at that index. 
// Without y, the regex searches forward and can match later in the string, which would silently skip unrecognized characters
/** @type {[TokenType, RegExp][]} */
const RULES = [
  [TokenType.WS,      /\s+/y],           // skipped
  [TokenType.COMMENT, /#[^\n]*/y],       // skipped: from # to end of line
  [TokenType.STRING,  /"[^"\n]*"/y],     // "..." on one line, no escapes yet
  [TokenType.ARROW,   /<-+|-+>/y],       // matches ->, -->, --->, <-, <---
  [TokenType.PUNCT,   /[;()[\]=|^_@$]/y],// single-character symbols
  [TokenType.IDENT,   /[A-Za-z]\w*/y],   // fill, and any other name
];

/**
 * Splits source text into a flat list of tokens using the ordered RULES table.
 * Whitespace and comments are consumed but not emitted. The first rule that
 * matches at the current position wins, and an EOF token is always appended.
 *
 * @param {string} src Raw source text to tokenize
 * @returns {Token[]} Tokens in source order
 * @throws {SyntaxError} If a character matches none of the rules
 */
export function tokenize(src) {
  const tokens = [];
  let pos = 0;                          // where we are in src

  while (pos < src.length) {
    let matched = false;

    for (const [type, re] of RULES) {
      re.lastIndex = pos;               // sticky: match exactly at pos
      const m = re.exec(src);
      if (m) {
        if (type !== TokenType.WS && type !== TokenType.COMMENT) {
          tokens.push(Token.of(type, m[0], pos));
        }
        pos = re.lastIndex;             // advance past the match
        matched = true;
        break;                          // first rule that matches wins
      }
    }

    if (!matched) {
      throw new SyntaxError(
        `Unexpected character ${JSON.stringify(src[pos])} at ${pos}`
      );
    }
  }

  tokens.push(Token.of(TokenType.EOF, '', pos));
  return tokens;
}
