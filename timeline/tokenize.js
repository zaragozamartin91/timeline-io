/**
 * Token type symbols. Each value is a unique symbol.
 * @enum {symbol}
 */
export const TokenType = Object.freeze({
  ARROW_TOP_MESSAGE: Symbol('ARROW_TOP_MESSAGE'),
  ARROW_BOTTOM_MESSAGE: Symbol('ARROW_BOTTOM_MESSAGE'),
  TIMELINE_START: Symbol('TIMELINE_START'),
  LITTLE_BOX: Symbol('LITTLE_BOX'),
  MACRO_DEFINITION: Symbol('MACRO_DEFINITION'),
  TIMELINE_EXTENSION: Symbol('TIMELINE_EXTENSION'),
  STATEMENT_END: Symbol('STATEMENT_END'),
  ARROW: Symbol('ARROW'),
  COMMENT: Symbol('COMMENT'),
  WS: Symbol('WS'),
  EOF: Symbol('EOF'),
  ERROR: Symbol('ERROR'),
});

/**
 * A single lexical token.
 */
export class Token {
  /** @type {TokenType} Kind of token */ type;
  /** @type {string} Matched source text */ value;
  /** @type {string[]} Capture groups of the match, in order; empty if none */ content;
  /** @type {number} Index of the first character in the source */ pos;
  /** @type {number} Index of the Last character in the source */ lastIndex;

  /**
   * @param {{type: TokenType, value?: string, content?: string[], pos?: number, lastIndex?: number}} params
   */
  constructor({ type, value = '', content = [], pos = 0, lastIndex = 0 }) {
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
      /*  
      slice(1) drops the full match (match[0] stays in value).
      ?? '' keeps string[] honest: an optional group that did not participate is undefined 
      */
      content: match.slice(1).map((group) => group ?? ''),
      pos: match.index,
      lastIndex: regexp.lastIndex,
    });
  }
}


/** @type {Record<symbol, RegExp>} */
const __Regex = {}
/// The y flag makes the regex sticky. With re.lastIndex set, exec only matches starting exactly at that index. 
// Without y, the regex searches forward and can match later in the string, which would silently skip unrecognized characters
__Regex[TokenType.COMMENT] =                /#[^\n]*/y;                           // matches from # to end of line
__Regex[TokenType.ARROW_TOP_MESSAGE] =      /\^\(\s*"([^"\n]*)"\s*\)/y;           // matches ^("Top message")
__Regex[TokenType.ARROW_BOTTOM_MESSAGE] =   /\_\(\s*"([^"\n]*)"\s*\)/y;           // matches _("Bottom message")
__Regex[TokenType.TIMELINE_START] =         /\@\(\s*"([^"\n]*)"\s*\)/y;           // matches @("Timeline start")
__Regex[TokenType.LITTLE_BOX] =             /\[\s*"([^"\n]*)"\s*\]/y;             // matches ["Box message"]
__Regex[TokenType.MACRO_DEFINITION] =       /\$([A-Za-z]+)\s*=\s*"([^"\n]*)"/y;   // matches $macro="Macro value"
__Regex[TokenType.ARROW] =                  /<-{1,4}|-{1,4}>/y;                           // matches ->, -->, --->, <-, <---
__Regex[TokenType.TIMELINE_EXTENSION] =     /\|/y;                                // matches |
__Regex[TokenType.STATEMENT_END] =          /;/y;                                 // matches ;
__Regex[TokenType.WS] =                     /\s+/y;                               // skipped
export const Regex = Object.freeze(__Regex);


// Symbol keys are skipped by Object.entries, so read them with getOwnPropertySymbols.
// Insertion order of __Regex sets match priority.
/** @type {[TokenType, RegExp][]} */
const RULES = /** @type {[TokenType, RegExp][]} */ (
  Object.getOwnPropertySymbols(Regex).map((type) => [type, Regex[type]])
);

/**
 * The tokens produced from one source text, in source order, ending with EOF.
 */
export class Lexicon {
  /** @type {Token[]} Tokens in source order */ tokens;

  /**
   * @param {{tokens: Token[]}} params
   */
  constructor({ tokens = [] }) {
    this.tokens = tokens;
  }

  /**
   * @returns {boolean} True if any token is of type ERROR
   */
  failed() {
    return this.tokens.some((token) => token.type === TokenType.ERROR);
  }

  /**
   * @returns {boolean} True if no token is of type ERROR
   */
  success() {
    return !this.failed();
  }
}

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
   * @returns {Lexicon} Tokens in source order
   * @throws {SyntaxError} If a character matches none of the rules
   */
  lexicon({src}) {
    const tokens = [];
    let pos = 0;                          // where we are in src

    let syntaxOk = true;
    while (pos < src.length && syntaxOk) {
      let matched = false;

      for (let index = 0; index < RULES.length && matched == false; index++) {
        const [tokenType] = RULES[index];
        const theToken = this.token({ src, tokenType, pos });
        if (theToken) {
          tokens.push(theToken);
          pos = theToken.lastIndex; // advance past the match
          matched = true;
        }
      }

      if (!matched) {
        tokens.push(Token.of(TokenType.ERROR, src, pos));
        syntaxOk = false; // halt parsing
      }
    }

    tokens.push(Token.of(TokenType.EOF, '', pos));
    return new Lexicon({ tokens });
  }
}

/**
 * Splits source text into a flat list of tokens using the ordered RULES table.
 * Whitespace and comments are consumed but not emitted. The first rule that
 * matches at the current position wins, and an EOF token is always appended.
 *
 * @param {string} src Raw source text to tokenize
 * @returns {Lexicon} Tokens in source order
 * @throws {SyntaxError} If a character matches none of the rules
 */
export function tokenize(src) {
  const tokenizer = new Tokenizer()
  return tokenizer.lexicon({ src });
}
