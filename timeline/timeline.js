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
  /** @type {number} Arrow width */ width=0;
  /** @type {number} Arrow height */ height=0;
  /** @type {number[]} [topLeftX, topLeftY, bottomRightX, bottomRightY] */ viewBox=[0,0,0,0];
  /** @type {number[]} [x1, y1, x2, y2, x3, y3] */ polygonPoints=[0,0,0,0,0,0];
  /** @type {string} Color of the Point */ polygonFill="";
  /** @type {number} Shaft width */ rectX=0;
  /** @type {number} Shaft height */ rectY=0;
  /** @type {number} Shaft topLeftX */ rectWidth=0;
  /** @type {number} Shaft topLeftY */ rectHeight=0;
  /** @type {string} Color of the Shaft */ rectFill="";
  /** @type {boolean} Indicates whether the arrow is to be flipped */ flipped=false;

  /**
   * @param {number} width Arrow width
   * @param {number} height Arrow height
   * @param {number[]} viewBox [topLeftX, topLeftY, bottomRightX, bottomRightY]
   * @param {number[]} polygonPoints [x1, y1, x2, y2, x3, y3]
   * @param {string} polygonFill Color of the Point
   * @param {number} rectWidth Shaft width
   * @param {number} rectHeight Shaft height
   * @param {number} rectX Shaft topLeftX
   * @param {number} rectY Shaft topLeftY
   * @param {string} rectFill Color of the Shaft
   */
  constructor (
    width, height,
    viewBox,
    polygonPoints, polygonFill,
    rectWidth, rectHeight, rectX, rectY, rectFill) {
    this.width = width;
    this.height = height;
    this.viewBox = viewBox;
    this.polygonPoints = polygonPoints;
    this.polygonFill = polygonFill;
    this.rectX = rectX;
    this.rectY = rectY;
    this.rectWidth = rectWidth;
    this.rectHeight = rectHeight;
    this.rectFill = rectFill;
  }

  /* Static function to create an arrow from an object */
  static fromObject({
    width, height,
    viewBox,
    polygonPoints, polygonFill,
    rectWidth, rectHeight, rectX, rectY, rectFill
  }) {
    return new ArrowSvg(
      width,
      height,
      viewBox,
      polygonPoints,
      polygonFill,
      rectWidth,
      rectHeight,
      rectX,
      rectY,
      rectFill
    );
  }

  viewBoxText() {
    const vb=this.viewBox;
    return `"${vb[0]} ${vb[1]} ${vb[2]} ${vb[3]}"`;
  }

  polygonText() {
    const pp=this.polygonPoints;
    return `"${pp[0]},${pp[1]} ${pp[2]},${pp[3]} ${pp[4]},${pp[5]}"`;
  }

  get innerHTML() {
    return  `<polygon points=${this.polygonText()} fill=${this.polygonFill} />` + 
            `<rect x="${this.rectX}" y="${this.rectY}" width="${this.rectWidth}" height="${this.rectHeight}" fill="${this.rectFill}" />`
  }

  get outerHTML() {
    const flipStyle = this.flipped ? ' style="transform: scaleX(-1)"' : '';
    return `<svg ${flipStyle} width="${this.width}" height="${this.height}" viewBox=${this.viewBoxText()}>${this.innerHTML}</svg>`
  }

  flip() {
    const flipped = new ArrowSvg(
      this.width, this.height,
      this.viewBox,
      this.polygonPoints, this.polygonFill,
      this.rectWidth, this.rectHeight, this.rectX, this.rectY, this.rectFill
    );
    flipped.flipped = !this.flipped;
    return flipped;
  }
}

class LongArrowSvg {
  arrowSvg = new ArrowSvg();

  /**
   * Shaft is sized EITHER absolute (shaftLen/shaftHeight) OR by fraction of base (shaftLenPerc/shaftHeiPerc).
   * @param {{width: number, height: number}} baseDimensions Svg width & height
   * @param {{shaftLen?: number, shaftHeight?: number, shaftLenPerc?: number, shaftHeiPerc?: number}} shaftDimensions
   *   Absolute shaft size (same units as width/height) or percentage (0-1) of base size
   * @param {{polygonFill: string, rectFill: string}} fill Colors of arrow head and shaft
   */
  constructor(baseDimensions = {}, shaftDimensions = {}, fill = {}) {
      const { width, height } = baseDimensions;
      const { shaftLen, shaftHeight, shaftLenPerc, shaftHeiPerc } = shaftDimensions;
      const { polygonFill, rectFill } = fill;

      const vbWid = width * 100
      const vbHei = height * 100
      const viewBox = [0 , 0, vbWid, vbHei];

      const rectWidth = shaftLen !== undefined ? shaftLen * 100 : shaftLenPerc * vbWid;
      const rectHeight = shaftHeight !== undefined ? shaftHeight * 100 : shaftHeiPerc * vbHei;
      const rectX = 0
      const rectY = vbHei / 2 - rectHeight / 2

      const polygonPoints = [rectWidth,0 , rectWidth,vbHei, vbWid, vbHei/2]

      this.arrowSvg = ArrowSvg.fromObject({
        width,
        height,
        viewBox,
        polygonPoints,
        polygonFill,
        rectWidth,
        rectHeight,
        rectX,
        rectY,
        rectFill
      })
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
    100, 100, // width and height 
    [0, 0, 1000, 1000], // viewBox
    [500, 0, 1000, 500, 500, 1000], // polygon
    "#000000", // polygon fill
    500, 100, // rect width and height
    0, 500 - 100/2, // rect x and y
    "brown" // rect fill
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
    { shaftLenPerc: 0.7, shaftHeiPerc: 0.2 },
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
