/**
 * Token type symbols. Each value is a unique symbol.
 * @enum {symbol}
 */
export const TokenType = Object.freeze({
  ARROW_TOP_MESSAGE: Symbol('ARROW_TOP_MESSAGE'),
  ARROW_BOTTOM_MESSAGE: Symbol('ARROW_BOTTOM_MESSAGE'),
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
  /** @type {string} Group content */ content = '';
  /** @type {number} Index of the first character in the source */ pos = 0;

  /**
   * @param {{type: TokenType, value?: string, content?: string, pos?: number}} params
   */
  constructor({ type, value = '', content = '', pos = 0 }) {
    this.type = type;
    this.value = value;
    this.pos = pos;
    this.content = content;
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

  /**
   * Build a Token from a regex exec result.
   *
   * The token value is the full matched text (`match[0]`) and the position is
   * `match.index`, which is the exact start of a sticky match.
   *
   * @param {TokenType} type Kind of token
   * @param {RegExpExecArray} match Result of `re.exec(src)`
   * @returns {Token}
   */
  static ofRegex(type, match) {
    return new Token({
      type,
      value: match[0],
      content: match[1] ?? '',
      pos: match.index,
    });
  }
}

/// The y flag makes the regex sticky. With re.lastIndex set, exec only matches starting exactly at that index. 
// Without y, the regex searches forward and can match later in the string, which would silently skip unrecognized characters
/** @type {[TokenType, RegExp][]} */
const RULES = [
  [TokenType.ARROW_TOP_MESSAGE,     /\^\("([^"\n]*)"\)/y],  // matches ^("Top message")
  [TokenType.ARROW_BOTTOM_MESSAGE,  /_\("([^"\n]*)"\)/y],  // matches ^("Top message")

  [TokenType.WS,                /\s+/y],                // skipped
  [TokenType.COMMENT,           /#[^\n]*/y],            // skipped: from # to end of line
  [TokenType.STRING,            /"[^"\n]*"/y],          // "..." on one line, no escapes yet
  [TokenType.ARROW,             /<-+|-+>/y],            // matches ->, -->, --->, <-, <---
  [TokenType.PUNCT,             /[;()[\]=|^_@$]/y],     // single-character symbols
  [TokenType.IDENT,             /[A-Za-z]\w*/y],        // fill, and any other name
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

    for (let index = 0; index < RULES.length && matched == false; index++) {
      const [tokenType, regex] = RULES[index];
      regex.lastIndex = pos;
      const regexMatch = regex.exec(src);
      if (regexMatch) {
        const newToken = Token.ofRegex(tokenType, regexMatch);
        tokens.push(newToken);
        pos = regex.lastIndex;             // advance past the match
        matched = true
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
