/**
 * Abstract timeline statement. Instantiate a concrete subclass, not this class.
 */
export class MzStatement {
  constructor() {
    if (new.target === MzStatement) throw new TypeError('MzStatement is abstract');
  }

  /** @returns {symbol} Unique symbol identifying this statement type; each implementation must return its own */
  symbol() { throw new Error('symbol() not implemented'); }
}

/** Unique symbol identifying EmptyStatement */
export const EMPTY_STATEMENT = Symbol('EMPTY_STATEMENT');

/** Statement with no content. */
export class EmptyStatement extends MzStatement {
  /** @override */
  symbol() { return EMPTY_STATEMENT; }
}

/** Unique symbol identifying FullStatement */
export const FULL_STATEMENT = Symbol('FULL_STATEMENT');

/** Statement composed of other statements.
 * Rendering of a full statement should result in a TimelineRow
 */
export class FullStatement extends MzStatement {
  /** @type {MzStatement[]} */ statements;

  /**
   * @param {{statements?: MzStatement[]}} params
   */
  constructor({ statements = [] } = {}) {
    super();
    this.statements = statements;
  }

  /** @override */
  symbol() { return FULL_STATEMENT; }
}

/** Unique symbol identifying TextStatement */
export const TEXT_STATEMENT = Symbol('TEXT_STATEMENT');

/** Statement holding a piece of text. */
export class TextStatement extends MzStatement {
  /** @type {string} Text content; empty string when absent */ text;

  /**
   * @param {{text?: string}} params
   */
  constructor({ text = '' } = {}) {
    super();
    this.text = text;
  }

  /** @override */
  symbol() { return TEXT_STATEMENT; }
}

/** Unique symbol identifying StartStatement */
export const START_STATEMENT = Symbol('START_STATEMENT');

/** Statement marking the start of a timeline, with optional text. */
export class StartStatement extends MzStatement {
  /** @type {TextStatement} Optional text; empty TextStatement when absent */ text;

  /**
   * @param {{text?: TextStatement}} params
   */
  constructor({ text = new TextStatement() } = {}) {
    super();
    this.text = text;
  }

  /** @override */
  symbol() { return START_STATEMENT; }
}

/**
 * Arrow length options. Each value is a unique symbol.
 * @enum {symbol}
 */
export const ArrowLength = Object.freeze({
  REGULAR: Symbol('REGULAR'),
  LONG: Symbol('LONG'),
  LONGER: Symbol('LONGER'),
  LONGEST: Symbol('LONGEST'),
  EXACT: Symbol('EXACT'),
});

/**
 * Arrow direction options. Each value is a unique symbol.
 * @enum {symbol}
 */
export const ArrowDirection = Object.freeze({
  LEFT: Symbol('LEFT'),
  RIGHT: Symbol('RIGHT'),
  AMBIDEXTROUS: Symbol('AMBIDEXTROUS'),
});

/** Unique symbol identifying ArrowTopText */
export const ARROW_TOP_TEXT_STATEMENT = Symbol('ARROW_TOP_TEXT_STATEMENT');

/** Statement holding text shown on top of an arrow. */
export class ArrowTopTextStatement extends MzStatement {
  /** @type {TextStatement} Optional text; empty TextStatement when absent */ text;

  /**
   * @param {{text?: TextStatement}} params
   */
  constructor({ text = new TextStatement() } = {}) {
    super();
    this.text = text;
  }

  /** @override */
  symbol() { return ARROW_TOP_TEXT_STATEMENT; }
}

/** Unique symbol identifying ArrowBottomText */
export const ARROW_BOTTOM_TEXT_STATEMENT = Symbol('ARROW_BOTTOM_TEXT_STATEMENT');

/** Statement holding text shown below an arrow. */
export class ArrowBottomTextStatement extends MzStatement {
  /** @type {TextStatement} Optional text; empty TextStatement when absent */ text;

  /**
   * @param {{text?: TextStatement}} params
   */
  constructor({ text = new TextStatement() } = {}) {
    super();
    this.text = text;
  }

  /** @override */
  symbol() { return ARROW_BOTTOM_TEXT_STATEMENT; }
}

/** Unique symbol identifying ArrowStatement */
export const ARROW_STATEMENT = Symbol('ARROW_STATEMENT');

/** Statement describing an arrow, with optional text on top and below. */
export class ArrowStatement extends MzStatement {
  /** @type {symbol} One of ArrowLength */ length;
  /** @type {symbol} One of ArrowDirection */ direction;
  /** @type {ArrowTopTextStatement} Optional; empty statement when absent */ topText;
  /** @type {ArrowBottomTextStatement} Optional; empty statement when absent */ bottomText;

  /**
   * @param {{length?: symbol, direction?: symbol, topText?: ArrowTopTextStatement, bottomText?: ArrowBottomTextStatement}} params
   */
  constructor({
    length = ArrowLength.REGULAR,
    direction = ArrowDirection.RIGHT,
    topText = new ArrowTopTextStatement(),
    bottomText = new ArrowBottomTextStatement(),
  } = {}) {
    super();
    this.length = length;
    this.direction = direction;
    this.topText = topText;
    this.bottomText = bottomText;
  }

  /** @override */
  symbol() { return ARROW_STATEMENT; }
}

/** Unique symbol identifying BoxStatement */
export const BOX_STATEMENT = Symbol('BOX_STATEMENT');

/** Statement holding text inside a box, with optional text. */
export class BoxStatement extends MzStatement {
  /** @type {TextStatement} Optional text; empty TextStatement when absent */ text;

  /**
   * @param {{text?: TextStatement}} params
   */
  constructor({ text = new TextStatement() } = {}) {
    super();
    this.text = text;
  }

  /** @override */
  symbol() { return BOX_STATEMENT; }
}

/**
 * Config type options. Each value is a unique symbol.
 * @enum {symbol}
 */
export const ConfigType = Object.freeze({
  FILLING: Symbol('FILLING'),
});

/** Unique symbol identifying ConfigStatement */
export const CONFIG_STATEMENT = Symbol('CONFIG_STATEMENT');

/** Statement holding an optional config type. */
export class ConfigStatement extends MzStatement {
  /** @type {symbol|null} One of ConfigType; null when absent */ configType;

  /**
   * @param {{configType?: symbol|null}} params
   */
  constructor({ configType = null } = {}) {
    super();
    this.configType = configType;
  }

  /** @override */
  symbol() { return CONFIG_STATEMENT; }
}

