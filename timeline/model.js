/**
 * Abstract HTML element. Subclasses implement innerHtml() and outerHtml().
 */
export class MzElement {
  constructor() {
    if (new.target === MzElement) throw new TypeError('MzElement is abstract');
  }

  /** @returns {string} Inner HTML of the element */
  innerHtml() { throw new Error('innerHtml() not implemented'); }

  /** @returns {string} Outer HTML of the element */
  outerHtml() { throw new Error('outerHtml() not implemented'); }
}

/**
 * SVG viewBox coordinates: top-left and bottom-right corners.
 */
export class ViewBox {
  /** @type {number} */ topLeftX = 0;
  /** @type {number} */ topLeftY = 0;
  /** @type {number} */ bottomRightX = 0;
  /** @type {number} */ bottomRightY = 0;

  /**
   * 
   * @param {{topLeftX?: number, topLeftY?: number, bottomRightX?: number, bottomRightY?: number}} param0 
   */
  constructor({ topLeftX = 0, topLeftY = 0, bottomRightX = 0, bottomRightY = 0 } = {}) {
    this.topLeftX = topLeftX;
    this.topLeftY = topLeftY;
    this.bottomRightX = bottomRightX;
    this.bottomRightY = bottomRightY;
  }

  viewBoxText() {
    return `"${this.topLeftX} ${this.topLeftY} ${this.bottomRightX} ${this.bottomRightY}"`;
  }
}

export class ArrowSvg extends MzElement {
  /** @type {{width: number, height: number}} */ baseDimensions;
  /** @type {ViewBox} */ viewBox = new ViewBox();
  /** @type {{x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, fill: string}} polygon Arrow head points and fill */ polygon;
  /** @type  {{width: number, height: number, x: number, y: number, fill: string}} */ rect;
  /** @type {boolean} Indicates whether the arrow is to be flipped */ flipped = false;

  /**
   * @param {{width: number, height: number}} baseDimensions Arrow dimensions
   * @param {ViewBox} viewBox ViewBox coordinates
   * @param {{x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, fill: string}} polygon Arrow head points and fill
   * @param {{width: number, height: number, x: number, y: number, fill: string}} rect Shaft dimensions and fill
   */
  constructor(
    baseDimensions = { width: 0, height: 0 },
    viewBox = new ViewBox(),
    polygon = { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0, fill: "" },
    rect = { width: 0, height: 0, x: 0, y: 0, fill: "" }
  ) {
    super();
    this.baseDimensions = baseDimensions;
    this.viewBox = viewBox;
    this.polygon = polygon;
    this.rect = rect;
  }

  viewBoxText() {
    return this.viewBox.viewBoxText();
  }

  polygonText() {
    const p = this.polygon;
    return `"${p.x1},${p.y1} ${p.x2},${p.y2} ${p.x3},${p.y3}"`;
  }

  /** @override */
  innerHtml() {
    const r = this.rect;
    return  `<polygon points=${this.polygonText()} fill=${this.polygon.fill} />` +
            `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" fill="${r.fill}" />`
  }

  /** @override */
  outerHtml() {
    const flipStyle = this.flipped ? ' style="transform: scaleX(-1)"' : '';
    const bd = this.baseDimensions;
    return `<svg ${flipStyle} width="${bd.width}" height="${bd.height}" viewBox=${this.viewBoxText()}>${this.innerHtml()}</svg>`
  }

  flip() {
    const flipped = new ArrowSvg(
      this.baseDimensions,
      this.viewBox,
      this.polygon,
      this.rect
    );
    flipped.flipped = !this.flipped;
    return flipped;
  }

  get width() {
    return this.baseDimensions.width
  }
}

export class LongArrowSvg extends MzElement {
  /** @type {ArrowSvg} */
  arrowSvg;

  /**
   * Shaft is sized EITHER absolute (shaftLen/shaftHei) OR by fraction of base (shaftLenPerc/shaftHeiPerc).
   * @param {{width: number, height: number}} baseDimensions Svg width & height
   * @param {{shaftLen?: number, shaftHei?: number, shaftLenPerc?: number, shaftHeiPerc?: number}} shaftDimensions
   *   Absolute shaft size (same units as width/height) or percentage (0-1) of base size
   * @param {{polygonFill: string, rectFill: string}} fill Colors of arrow head and shaft
   */
  constructor(
    baseDimensions = { width: 0, height: 0}, 
    shaftDimensions = { shaftLen: 0, shaftHei: 0, shaftLenPerc: 0, shaftHeiPerc: 0 }, 
    fill = { polygonFill: "", rectFill: "" }
  ) {
      super();
      const { width, height } = baseDimensions;
      const { shaftLen, shaftHei, shaftLenPerc, shaftHeiPerc } = shaftDimensions;
      const { polygonFill, rectFill } = fill;

      const vbWid = width * 100
      const vbHei = height * 100

      const rectWidth = shaftLen ? shaftLen * 100 : shaftLenPerc ? shaftLenPerc * vbWid : 0;
      const rectHeight = shaftHei ? shaftHei * 100 : shaftHeiPerc ? shaftHeiPerc * vbHei : 0;
      const rectX = 0
      const rectY = vbHei / 2 - rectHeight / 2

      this.arrowSvg = new ArrowSvg(
        { width, height },
        new ViewBox({ topLeftX: 0, topLeftY: 0, bottomRightX: vbWid, bottomRightY: vbHei }),
        { x1: rectWidth, y1: 0, x2: rectWidth, y2: vbHei, x3: vbWid, y3: vbHei/2, fill: polygonFill },
        { width: rectWidth, height: rectHeight, x: rectX, y: rectY, fill: rectFill }
      )
  }

  /* Delegate methods of ArrowSvg */
  viewBoxText() { return this.arrowSvg.viewBoxText(); }
  polygonText() { return this.arrowSvg.polygonText(); }
  /** @override */
  innerHtml() { return this.arrowSvg.innerHtml(); }
  /** @override */
  outerHtml() { return this.arrowSvg.outerHtml(); }
  get width() { return this.arrowSvg.width; }

  flip() {
    const flipped = this.arrowSvg.flip();
    const longFlipped = new LongArrowSvg()
    longFlipped.arrowSvg = flipped
    return longFlipped;
  }

  /**
   * Get the inner arrow svg component
   */
  get svg() { return this.arrowSvg }
}


export class VerticalSvg extends MzElement {
  /** @type {number} Svg width */ width=0;
  /** @type {number} Svg height */ height=0;
  /** @type {ViewBox} */ viewBox = new ViewBox();
  /** @type {number} Line thickness */ lineWidth=0;
  /** @type {string} Color of the line */ lineFill="";

  /**
   * 
   * @param {{width: number, height: number, viewBox: ViewBox, lineWidth: number, lineFill: string}} param0 
   */
  constructor({width, height, viewBox, lineWidth, lineFill}) {
    super();
    this.width = width;
    this.height = height;
    this.viewBox = viewBox;
    this.lineWidth = lineWidth;
    this.lineFill = lineFill;
  }

  viewBoxText() {
    return this.viewBox.viewBoxText();
  }

  /** @override */
  innerHtml() {
    const vb = this.viewBox;
    const rectX = vb.topLeftX + vb.bottomRightX / 2 - this.lineWidth / 2;
    return `<rect x="${rectX}" y="${vb.topLeftY}" width="${this.lineWidth}" height="${vb.bottomRightY}" fill="${this.lineFill}" />`;
  }

  /** @override */
  outerHtml() {
    return `<svg width="${this.width}" height="${this.height}" viewBox=${this.viewBoxText()}>${this.innerHtml()}</svg>`;
  }
}

export class TextArrow extends MzElement {
  /** @type {ArrowSvg} */ arrow;
  /** @type {String} */ text;
  /** @type {boolean} */ hidden;
  /** @type {boolean} */ flipped;
  /** @type {String} */ bottomText;

  /**
   * New element with arrow and text on top
   * @param {{arrow: ArrowSvg, text?: string, hidden?: boolean, flipped?: boolean, bottomText?: string}} params
   *   arrow: Arrow element; text: Text on top of the arrow; bottomText: Text below the arrow
   */
  constructor({ arrow, text, hidden = false, flipped = false, bottomText = '' }) {
    super();
    this.arrow = arrow;
    this.text = text || '';
    this.hidden = hidden || false;
    this.flipped = flipped || false;
    this.bottomText = bottomText || '';
  }

  /** @override */
  innerHtml() {
    const theArrow = this.flipped ? this.arrow.flip() : this.arrow
    const textSpanStyle = `width: ${theArrow.width}px;`
    return  `<span class="text-arrow-top" style="${textSpanStyle}">${this.text}</span>` +
            `${theArrow.outerHtml()}` +
            `<span class="text-arrow-bottom" style="${textSpanStyle}">${this.bottomText}</span>`
  }

  /** @override */
  outerHtml() {
    const hideStyle = this.hidden ? ' style="visibility: hidden;"' : '';
    return `<span class="text-arrow" ${hideStyle}>${this.innerHtml()}</span>`
  }

  clone() {
    return new TextArrow({
      arrow: this.arrow,
      text: this.text,
      hidden: this.hidden,
      flipped: this.flipped,
      bottomText: this.bottomText
    })
  }

  flip() {
    const flipped = this.clone()
    flipped.flipped = !this.flipped
    return flipped
  }

  hide() {
    const hidden = this.clone()
    hidden.hidden = true
    return hidden
  }
}

export class CircleSvg extends MzElement {
  /** @type {number} */ width=0;
  /** @type {number} */ height=0;
  /** @type {number} */ centerX=0;
  /** @type {number} */ centerY=0;
  /** @type {number} */ radius=0;
  /** @type {ViewBox} */ viewBox = new ViewBox();
  /** @type {string} Color of the line */ lineFill="";

  /**
   * 
   * @param {{width: number, height: number, centerX: number, centerY: number, radius: number, viewBox: ViewBox, lineFill: string}} param0 
   */
  constructor({width, height, centerX, centerY, radius, viewBox, lineFill}) {
    super();
    this.width = width;
    this.height = height;
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.viewBox = viewBox;
    this.lineFill = lineFill;
  }

  viewBoxText() {
    return this.viewBox.viewBoxText();
  }

  /** @override */
  innerHtml() {
    return `<circle cx="${this.centerX}" cy="${this.centerY}" r="${this.radius}" fill="${this.lineFill}" />`
  }

  /** @override */
  outerHtml() {
    return `<svg width="${this.width}" height="${this.height}" viewBox=${this.viewBoxText()}>${this.innerHtml()}</svg>`
  }
}

/**
 * Lollypop: circle on top, vertical bar below, overlapping by circleRadius.
 * Composes CircleSvg and VerticalSvg; viewBox is inferred from the parameters.
 */
export class LollypopSvg extends MzElement {
  /** @type {number} */ width=0;
  /** @type {number} */ height=0;
  /** @type {CircleSvg} */ circle;
  /** @type {VerticalSvg} */ bar;
  /** @type {string} Optional text shown on top of the circle */ text = '';

  /**
   * @param {{circleRadius: number, barWidth: number, barHeight: number, filling: string, text?: string}} params
   */
  constructor({ circleRadius, barWidth, barHeight, filling, text }) {
    super();
    this.text = text || '';
    this.width = Math.max(2 * circleRadius, barWidth);
    this.height = circleRadius + barHeight;
    const viewBox = new ViewBox({ topLeftX: 0, topLeftY: circleRadius, bottomRightX: this.width, bottomRightY: barHeight });
    this.circle = new CircleSvg({
      width: this.width,
      height: this.height,
      centerX: this.width / 2,
      centerY: circleRadius,
      radius: circleRadius,
      lineFill: filling,
      viewBox
    });
    // Bar starts at the circle's center line, so it overlaps the bottom half of the circle
    this.bar = new VerticalSvg({
      width: this.width,
      height: this.height,
      viewBox: viewBox,
      lineWidth: barWidth,
      lineFill: filling
    });
  }

  viewBoxText() {
    return `"0 0 ${this.width} ${this.height}"`;
  }

  /** @override */
  innerHtml() {
    return this.bar.innerHtml() + this.circle.innerHtml();
  }

  /** @override */
  outerHtml() {
    const svg = `<svg width="${this.width}" height="${this.height}" viewBox=${this.viewBoxText()}>${this.innerHtml()}</svg>`;
    if (!this.text) return svg;
    const textStyle = `width: ${this.width}px;`;
    return `<span class="lollypop">` +
           `<span class="lollypop-text" style="${textStyle}">${this.text}</span>${svg}</span>`;
  }
}

export class LittleBox extends MzElement {
  /** @type {string} Text shown inside the box */ text;

  /**
   * @param {{text?: string}} params
   */
  constructor({ text } = {}) {
    super();
    this.text = text || '';
  }

  /** @override */
  innerHtml() {
    return this.text;
  }

  /** @override */
  outerHtml() {
    return `<span class="little-box">${this.innerHtml()}</span>`;
  }
}
