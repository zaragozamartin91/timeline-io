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
  /** @type {number} width Arrow width */ width=0;
  /** @type {number} height Arrow height */ height=0;
  /** @type {number[]} viewBox [topLeftX, topLeftY, bottomRightX, bottomRightY] */ viewBox=[0,0,0,0];
  /** @type {number[]} polygonPoints [x1, y1, x2, y2, x3, y3] */ polygonPoints=[0,0,0,0,0,0];
  /** @type {string} polygonFill Color of the Point */ polygonFill="";
  /** @type {number} rectWidth Shaft width */ rectX=0;
  /** @type {number} rectHeight Shaft height */ rectY=0;
  /** @type {number} rectX Shaft topLeftX */ rectWidth=0;
  /** @type {number} rectY Shaft topLeftY */ rectHeight=0;
  /** @type {string} rectFill Color of the Shaft */ rectFill="";

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

  svgText() {
    return `
    <svg width="${this.width}" height="${this.height}" viewBox=${this.viewBoxText()}>
      <polygon points=${this.polygonText()} fill=${this.polygonFill} />
      <rect x="${this.rectX}" y="${this.rectY}" width="${this.rectWidth}" height="${this.rectHeight}" fill="${this.rectFill}" />
    </svg>
  `;
  }
}

class LongArrowSvg {
  arrowSvg = new ArrowSvg();

  constructor(
    width, height,
    shaftLenPercentage, shaftHeiPercentage,
    polygonFill, rectFill
  ) {
      const vbWid = width * 100
      const vbHei = height * 100
      const viewBox = [0 , 0, vbWid, vbHei];
      const rectWidth = shaftLenPercentage * vbWid
      const rectHeight = shaftHeiPercentage * vbHei
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
  svgText() { return this.arrowSvg.svgText(); }
}


class VerticalSvg {
  /** @type {number} width Svg width */ width=0;
  /** @type {number} height Svg height */ height=0;
  /** @type {number[]} viewBox [topLeftX, topLeftY, bottomRightX, bottomRightY] */ viewBox=[0,0,0,0];
  /** @type {number} lineWidth Line thickness */ lineWidth=0;
  /** @type {string} lineFill Color of the line */ lineFill="";

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

  svgText() {
    const vb=this.viewBox;
    const rectX = vb[0] + vb[2] / 2 - this.lineWidth / 2;
    const rectY = vb[1];
    const rectHeight = vb[3];
    return `
    <svg width="${this.width}" height="${this.height}" viewBox=${this.viewBoxText()}>
      <rect x="${rectX}" y="${rectY}" width="${this.lineWidth}" height="${rectHeight}" fill="${this.lineFill}" />
    </svg>
  `;
  }
}


/**
 * Creates an svg element
 * @param {Object} svgTextBearer
 * @returns {JQuery<HTMLElement>}
 */
function svgElement(svgTextBearer) {
  const svg = $(svgTextBearer.svgText());
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
    75, 25, // width and height
    0.7, 0.2, // shaft length and height
    "#000000", // polygon fill
    "brown" // rect fill
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
    75, 25, // width and height
    0.7, 0.2, // shaft length and height
    "#000000", // polygon fill
    "brown" // rect fill
  );
  const vertical = new VerticalSvg(
    40, 200, // width and height
    [0, 0, 40, 200], // viewBox
    50, // line width (same as svg width)
    "brown" // line fill
  );

  /* Let's put a vertical line centered and then an arrow on the right */

  const timelineRow = $(`
    <div class="timeline-row">
      <span class="timeline-row-left-padding">LEFT PADDING</span>
      ${vertical.svgText()}
      <span class="timeline-row-arrow-container">
        ${arrow.svgText()}
      </span>
      <span class="timeline-row-right-padding">RIGHT PADDING</span>
    </div>
  `)

  $("#preview").append(timelineRow);
}
