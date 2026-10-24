// const autoGrow = () => {
//   tx.style.height = 'auto';
//   tx.style.height = tx.scrollHeight + 'px';
// };
// tx.addEventListener('input', autoGrow);
// window.addEventListener('load', autoGrow);

// import { $ } from "jquery";
import $ from "jquery";
import { ArrowSvg, LongArrowSvg, VerticalSvg, TextArrow } from "./model.js";

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

  const textArrow = new TextArrow({
    arrow: arrow,
    text: "This is a message"
  });

  /* Let's put a vertical line centered and then an arrow on the right */

  const timelineRow = $(`
    <div>
      <div class="timeline-row">
        <div class="timeline-side left"></div>
        ${vertical.outerHTML}
        <div class="timeline-side right">${arrow.outerHTML}</div>
      </div>


      <div class="timeline-row">
        <div class="timeline-side left">${longerArrow.flip().outerHTML}</div>
        ${vertical.outerHTML}
        <div class="timeline-side right"></div>
      </div>


      <div class="timeline-row">
        <div class="timeline-side left"></div>
        ${vertical.outerHTML}
        <div class="timeline-side right">
          ${textArrow.outerHTML}
          <span class="little-box">This is a box</span>
        </div>
      </div>
    </div>
  `)

  $("#preview").append(timelineRow);
}