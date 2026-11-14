/**
 * Statement type symbols. Each value is a unique symbol.
 * @enum {symbol}
 */
export const Statement = Object.freeze({
  EMPTY: Symbol('EMPTY_STATEMENT'),
  FULL: Symbol('FULL_STATEMENT'),
  TEXT: Symbol('TEXT_STATEMENT'),
  START: Symbol('START_STATEMENT'),
  CONFIG: Symbol('CONFIG_STATEMENT'),
  COMMENT: Symbol('COMMENT_STATEMENT'),
  TIMELINE_EXTENSION: Symbol('TIMELINE_EXTENSION_STATEMENT'),
  ARROW_TOP_TEXT: Symbol('ARROW_TOP_TEXT_STATEMENT'),
  ARROW_BOTTOM_TEXT: Symbol('ARROW_BOTTOM_TEXT_STATEMENT'),
  ARROW: Symbol('ARROW_STATEMENT'),
  BOX: Symbol('BOX_STATEMENT'),
});

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


/**
 * Config type options. Each value is a unique symbol.
 * @enum {symbol}
 */
export const ConfigType = Object.freeze({
  FILLING: Symbol('FILLING'),
});


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

/** Statement with no content. */
export class EmptyStatement extends MzStatement {
  /** @override */
  symbol() { return Statement.EMPTY; }
}

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
  symbol() { return Statement.FULL; }
}

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
  symbol() { return Statement.TEXT; }
}

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
  symbol() { return Statement.START; }
}

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
  symbol() { return Statement.ARROW_TOP_TEXT; }
}

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
  symbol() { return Statement.ARROW_BOTTOM_TEXT; }
}

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
  symbol() { return Statement.ARROW; }
}

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
  symbol() { return Statement.BOX; }
}

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
  symbol() { return Statement.CONFIG; }
}

/** Statement holding a comment value. */
export class CommentStatement extends MzStatement {
  /** @type {string} Comment value; empty string when absent */ value;

  /**
   * @param {{value?: string}} params
   */
  constructor({ value = '' } = {}) {
    super();
    this.value = value;
  }

  /** @override */
  symbol() { return Statement.COMMENT; }
}

/** Statement extending a timeline. No fields yet. */
export class TimelineExtensionStatement extends MzStatement {
  /** @override */
  symbol() { return Statement.TIMELINE_EXTENSION; }
}
