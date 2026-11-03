// const autoGrow = () => {
//   tx.style.height = 'auto';
//   tx.style.height = tx.scrollHeight + 'px';
// };
// tx.addEventListener('input', autoGrow);
// window.addEventListener('load', autoGrow);

// import { $ } from "jquery";
import jQuery from "jquery";
import { ArrowSvg, LongArrowSvg, VerticalSvg, TextArrow, CircleSvg, LollypopSvg, ViewBox, LittleBox } from "./model.js";

/**
 * This is the same as jQuery(document).ready
 */
jQuery(function() {
  addTimelineDraft();
});


function addTimelineDraft() {
  const arrow = new LongArrowSvg(
    { width: 75, height: 25 },
    { shaftLenPerc: 0.7, shaftHeiPerc: 0.2 },
    { polygonFill: "#000000", rectFill: "brown" }
  );
  const vertical = new VerticalSvg({
    width: 40,
    height: 200,
    viewBox: new ViewBox({ topLeftX: 0, topLeftY: 0, bottomRightX: 40, bottomRightY: 200 }),
    lineWidth: 50, // same as svg width
    lineFill: "brown"
  });

  const longerArrow = new LongArrowSvg(
    { width: 100, height: 25 },
    { shaftLen: 75, shaftHei: 10 },
    { polygonFill: "#000000", rectFill: "brown" }
  );

  const textArrow = new TextArrow({
    arrow: arrow.svg,
    text: "This is a message"
  });


  const lollypop = new LollypopSvg({
    circleRadius: 50,
    barWidth: 40,
    barHeight: 200,
    filling: "brown",
    text: "2026-10-30"
  });

  const littleBox = new LittleBox({ text: "This is a box" });

  const timelineRow = jQuery(`
    <div>

      <div class="timeline-row">
        <div class="timeline-side left"></div>
        ${lollypop.outerHtml()}
        <div class="timeline-side right"></div>
      </div>

      <div class="timeline-row">
        <div class="timeline-side left"></div>
        ${vertical.outerHtml()}
        <div class="timeline-side right">${arrow.outerHtml()}</div>
      </div>


      <div class="timeline-row">
        <div class="timeline-side left">${longerArrow.flip().outerHtml()}</div>
        ${vertical.outerHtml()}
        <div class="timeline-side right"></div>
      </div>


      <div class="timeline-row">
        <div class="timeline-side left"></div>
        ${vertical.outerHtml()}
        <div class="timeline-side right">
          ${textArrow.outerHtml()}
          ${littleBox.outerHtml()}
        </div>
      </div>
    </div>
  `)

  jQuery("#preview").append(timelineRow);
}