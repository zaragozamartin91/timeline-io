// const autoGrow = () => {
//   tx.style.height = 'auto';
//   tx.style.height = tx.scrollHeight + 'px';
// };
// tx.addEventListener('input', autoGrow);
// window.addEventListener('load', autoGrow);

// import { $ } from "jquery";
import $ from "jquery";

/**
 * This is the same as $(document).ready
 */
$(function() {
  // addTreeToPreview();
  // addArrowToPreview();
  addLongArrowToPreview();
  addVerticalToPreview();
  addVerticalWithCenteredArrow();
});

// $(document).ready(function () {
//   addTreeToPreview();
// });

class ArrowSvg {
  /** @type {Object} {width, height} */ baseDimensions = {};
  /** @type {Object} {topLeftX, topLeftY, bottomRightX, bottomRightY} */ viewBox = {};
  /** @type {Object} {x1, y1, x2, y2, x3, y3, fill} */ polygon = {};
  /** @type {Object} {width, height, x, y, fill} */ rect = {};
  /** @type {boolean} Indicates whether the arrow is to be flipped */ flipped = false;

  /**
   * @param {{width: number, height: number}} baseDimensions Arrow dimensions
   * @param {{topLeftX: number, topLeftY: number, bottomRightX: number, bottomRightY: number}} viewBox ViewBox coordinates
   * @param {{x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, fill: string}} polygon Arrow head points and fill
   * @param {{width: number, height: number, x: number, y: number, fill: string}} rect Shaft dimensions and fill
   */
  constructor(
    baseDimensions = {},
    viewBox = {},
    polygon = {},
    rect = {}
  ) {
    this.baseDimensions = baseDimensions;
    this.viewBox = viewBox;
    this.polygon = polygon;
    this.rect = rect;
  }

  viewBoxText() {
    const vb = this.viewBox;
    return `"${vb.topLeftX} ${vb.topLeftY} ${vb.bottomRightX} ${vb.bottomRightY}"`;
  }

  polygonText() {
    const p = this.polygon;
    return `"${p.x1},${p.y1} ${p.x2},${p.y2} ${p.x3},${p.y3}"`;
  }

  get innerHTML() {
    const r = this.rect;
    return  `<polygon points=${this.polygonText()} fill=${this.polygon.fill} />` +
            `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" fill="${r.fill}" />`
  }

  get outerHTML() {
    const flipStyle = this.flipped ? ' style="transform: scaleX(-1)"' : '';
    const bd = this.baseDimensions;
    return `<svg ${flipStyle} width="${bd.width}" height="${bd.height}" viewBox=${this.viewBoxText()}>${this.innerHTML}</svg>`
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
}

class LongArrowSvg {
  arrowSvg = new ArrowSvg();

  /**
   * Shaft is sized EITHER absolute (shaftLen/shaftHei) OR by fraction of base (shaftLenPerc/shaftHeiPerc).
   * @param {{width: number, height: number}} baseDimensions Svg width & height
   * @param {{shaftLen?: number, shaftHei?: number, shaftLenPerc?: number, shaftHeiPerc?: number}} shaftDimensions
   *   Absolute shaft size (same units as width/height) or percentage (0-1) of base size
   * @param {{polygonFill: string, rectFill: string}} fill Colors of arrow head and shaft
   */
  constructor(baseDimensions = {}, shaftDimensions = {}, fill = {}) {
      const { width, height } = baseDimensions;
      const { shaftLen, shaftHei, shaftLenPerc, shaftHeiPerc } = shaftDimensions;
      const { polygonFill, rectFill } = fill;

      const vbWid = width * 100
      const vbHei = height * 100
      const viewBox = [0 , 0, vbWid, vbHei];

      const rectWidth = shaftLen !== undefined ? shaftLen * 100 : shaftLenPerc * vbWid;
      const rectHeight = shaftHei !== undefined ? shaftHei * 100 : shaftHeiPerc * vbHei;
      const rectX = 0
      const rectY = vbHei / 2 - rectHeight / 2

      this.arrowSvg = new ArrowSvg(
        { width, height },
        { topLeftX: 0, topLeftY: 0, bottomRightX: vbWid, bottomRightY: vbHei },
        { x1: rectWidth, y1: 0, x2: rectWidth, y2: vbHei, x3: vbWid, y3: vbHei/2, fill: polygonFill },
        { width: rectWidth, height: rectHeight, x: rectX, y: rectY, fill: rectFill }
      )
  }

  /* Delegate methods of ArrowSvg */
  viewBoxText() { return this.arrowSvg.viewBoxText(); }
  polygonText() { return this.arrowSvg.polygonText(); }
  get innerHTML() { return this.arrowSvg.innerHTML; }
  get outerHTML() { return this.arrowSvg.outerHTML; }

  flip() { 
    const flipped = this.arrowSvg.flip();
    const longFlipped = new LongArrowSvg()
    longFlipped.arrowSvg = flipped
    return longFlipped; 
  }
}


class VerticalSvg {
  /** @type {number} Svg width */ width=0;
  /** @type {number} Svg height */ height=0;
  /** @type {number[]} [topLeftX, topLeftY, bottomRightX, bottomRightY] */ viewBox=[0,0,0,0];
  /** @type {number} Line thickness */ lineWidth=0;
  /** @type {string} Color of the line */ lineFill="";

  /**
   * @param {number} width Svg width
   * @param {number} height Svg height
   * @param {number[]} viewBox [topLeftX, topLeftY, bottomRightX, bottomRightY]
   * @param {number} lineWidth Line thickness
   * @param {string} lineFill Color of the line
   */
  constructor(width, height, viewBox, lineWidth, lineFill) {
    this.width = width;
    this.height = height;
    this.viewBox = viewBox;
    this.lineWidth = lineWidth;
    this.lineFill = lineFill;
  }

  /* Static function to create a vertical line from an object */
  static fromObject({
    width, height,
    viewBox,
    lineWidth, lineFill
  }) {
    return new VerticalSvg(
      width,
      height,
      viewBox,
      lineWidth,
      lineFill
    );
  }

  viewBoxText() {
    const vb=this.viewBox;
    return `"${vb[0]} ${vb[1]} ${vb[2]} ${vb[3]}"`;
  }

  get innerHTML() {
    const vb = this.viewBox;
    const rectX = vb[0] + vb[2] / 2 - this.lineWidth / 2;
    return `<rect x="${rectX}" y="${vb[1]}" width="${this.lineWidth}" height="${vb[3]}" fill="${this.lineFill}" />`;
  }

  get outerHTML() {
    return `<svg width="${this.width}" height="${this.height}" viewBox=${this.viewBoxText()}>${this.innerHTML}</svg>`;
  }
}


/**
 * Creates an svg element
 * @param {Object} svgBearer
 * @returns {JQuery<HTMLElement>}
 */
function svgElement(svgBearer) {
  const svg = $(svgBearer.outerHTML);
  return svg;
}

function addArrowToPreview() {
  const arrowSvg = new ArrowSvg(
    { width: 100, height: 100 },
    { topLeftX: 0, topLeftY: 0, bottomRightX: 1000, bottomRightY: 1000 },
    { x1: 500, y1: 0, x2: 1000, y2: 500, x3: 500, y3: 1000, fill: "#000000" },
    { width: 500, height: 100, x: 0, y: 450, fill: "brown" }
  );
  /**
   * @type JQuery<HTMLElement>
   */
  const svg = svgElement(arrowSvg);

  $("#preview").append(svg);
}

function addLongArrowToPreview() {
  const arrowSvg = new LongArrowSvg(
    { width: 75, height: 25 },
    { shaftLenPerc: 0.7, shaftHeiPerc: 0.2 },
    { polygonFill: "#000000", rectFill: "brown" }
  );
  /**
   * @type JQuery<HTMLElement>
   */
  const svg = svgElement(arrowSvg.arrowSvg);

  $("#preview").append(svg);
}

function addVerticalToPreview() {
  const verticalSvg = new VerticalSvg(
    50, 200, // width and height
    [0, 0, 50, 200], // viewBox
    50, // line width (same as svg width)
    "brown" // line fill
  );
  /**
   * @type JQuery<HTMLElement>
   */
  const svg = svgElement(verticalSvg);

  $("#preview").append(svg);
}

function addVerticalWithCenteredArrow() {
  const arrow = new LongArrowSvg(
    { width: 75, height: 25 },
    { shaftLenPerc: 0.7, shaftHeiPerc: 0.2 },
    { polygonFill: "#000000", rectFill: "brown" }
  );
  const vertical = new VerticalSvg(
    40, 200, // width and height
    [0, 0, 40, 200], // viewBox
    50, // line width (same as svg width)
    "brown" // line fill
  );

  const longerArrow = new LongArrowSvg(
    { width: 100, height: 25 },
    { shaftLen: 75, shaftHei: 10 },
    { polygonFill: "#000000", rectFill: "brown" }
  );

  /* Let's put a vertical line centered and then an arrow on the right */

  const timelineRow = $(`
    <div>
      <div class="timeline-row">
        <span class="timeline-row-left-padding"></span>
        
        <span id="toHide" class="timeline-row-arrow-container" style="visibility: hidden;">
          ${arrow.outerHTML}
        </span>

        
        ${vertical.outerHTML}
        
        
        <span class="timeline-row-arrow-container">
          ${arrow.outerHTML}
        </span>

        <span class="timeline-row-right-padding"></span>
      </div>
      <div class="timeline-row">
        <span class="timeline-row-left-padding"></span>
        
        <span id="toHide" class="timeline-row-arrow-container" >
          ${longerArrow.flip().outerHTML}
        </span>

        
        ${vertical.outerHTML}
        
        
        <span class="timeline-row-arrow-container" style="visibility: hidden;">
          ${longerArrow.outerHTML}
        </span>

        <span class="timeline-row-right-padding"></span>
      </div>
    </div>
  `)

  $("#preview").append(timelineRow);
}
