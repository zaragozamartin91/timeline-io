/**
 * Token type symbols. Each value is a unique symbol.
 * @enum {symbol}
 */
export const TokenType = Object.freeze({
  ARROW_TOP_MESSAGE: Symbol('ARROW_TOP_MESSAGE'),
  ARROW_BOTTOM_MESSAGE: Symbol('ARROW_BOTTOM_MESSAGE'),
  TIMELINE_START: Symbol('TIMELINE_START'),
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
  /** @type {number} Index of the Last character in the source */ lastIndex = 0;

  /**
   * @param {{type: TokenType, value?: string, content?: string, pos?: number, lastIndex?: number}} params
   */
  constructor({ type, value = '', content = '', pos = 0, lastIndex = 0 }) {
    this.type = type;
    this.value = value;
    this.pos = pos;
    this.content = content;
    this.lastIndex = lastIndex;
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
   * @param {RegExp} regexp The sticky regex that produced `match`; its `lastIndex` is the index just past the matched text
   * @returns {Token}
   */
  static ofRegex(type, match, regexp) {
    return new Token({
      type,
      value: match[0],
      content: match[1] ?? '',
      pos: match.index,
      lastIndex: regexp.lastIndex,
    });
  }
}


/** @type {Record<symbol, RegExp>} */
const __Regex = {}
/// The y flag makes the regex sticky. With re.lastIndex set, exec only matches starting exactly at that index. 
// Without y, the regex searches forward and can match later in the string, which would silently skip unrecognized characters
__Regex[TokenType.ARROW_TOP_MESSAGE] =      /\^\(\s*"([^"\n]*)"\s*\)/y;   // matches ^("Top message")
__Regex[TokenType.ARROW_BOTTOM_MESSAGE] =   /\_\(\s*"([^"\n]*)"\s*\)/y;   // matches _("Bottom message")
__Regex[TokenType.TIMELINE_START] =         /\@\(\s*"([^"\n]*)"\s*\)/y;   // matches @("Timeline start")
__Regex[TokenType.WS] =                     /\s+/y;                       // skipped
__Regex[TokenType.COMMENT] =                /#[^\n]*/y;                   // skipped: from # to end of line
__Regex[TokenType.STRING] =                 /"[^"\n]*"/y;                 // "..." on one line, no escapes yet
__Regex[TokenType.ARROW] =                  /<-+|-+>/y;                   // matches ->, -->, --->, <-, <---
__Regex[TokenType.PUNCT] =                  /[;()[\]=|^_@$]/y;            // single-character symbols
__Regex[TokenType.IDENT] =                  /[A-Za-z]\w*/y;               // fill, and any other name
export const Regex = Object.freeze(__Regex);


// Symbol keys are skipped by Object.entries, so read them with getOwnPropertySymbols.
// Insertion order of __Regex sets match priority.
/** @type {[TokenType, RegExp][]} */
const RULES = /** @type {[TokenType, RegExp][]} */ (
  Object.getOwnPropertySymbols(Regex).map((type) => [type, Regex[type]])
);

export class Tokenizer {
  /** 
   * Try to match a single token of the given type at an exact position.
   *
   * Uses the sticky regex registered for `tokenType`, so the match must start
   * exactly at `pos`; it never searches forward.
   *
   * @param {Object} args
   * @param {string} args.src Raw source text
   * @param {symbol} args.tokenType Kind of token to try to match
   * @param {number} args.pos Index in `src` where the match must start
   * @returns {Token | null} The matched Token, or null if the rule does not match at `pos` */
  token({src, tokenType, pos}) {
    const regex = Regex[tokenType]
    regex.lastIndex = pos;
    const regexMatch = regex.exec(src);
    if (regexMatch) { return Token.ofRegex(tokenType, regexMatch, regex); } 
    else { return null; }
  }

  /**
   * Splits source text into a flat list of tokens using the ordered RULES table.
   * The first rule that matches at the current position wins, and an EOF token
   * is always appended.
   *
   * @param {Object} args
   * @param {string} args.src Raw source text to tokenize
   * @returns {Token[]} Tokens in source order
   * @throws {SyntaxError} If a character matches none of the rules
   */
  tokenize({src}) {
    const tokens = [];
    let pos = 0;                          // where we are in src

    while (pos < src.length) {
      let matched = false;

      for (let index = 0; index < RULES.length && matched == false; index++) {
        const [tokenType] = RULES[index];
        const theToken = this.token({ src, tokenType, pos });
        if (theToken) {
          tokens.push(theToken);
          pos = theToken.lastIndex;          // advance past the match
          matched = true;
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
}

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
  const tokenizer = new Tokenizer()
  return tokenizer.tokenize({ src });
}
