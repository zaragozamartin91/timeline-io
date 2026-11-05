// const autoGrow = () => {
//   tx.style.height = 'auto';
//   tx.style.height = tx.scrollHeight + 'px';
// };
// tx.addEventListener('input', autoGrow);
// window.addEventListener('load', autoGrow);

// import { $ } from "jquery";
import jQuery from "jquery";
/* tl is short for timeline */
import * as tl from "./model.js";

/**
 * This is the same as jQuery(document).ready
 */
jQuery(function() {
  addTimelineDraft();
});


function addTimelineDraft() {
  const arrow = new tl.LongArrowSvg({
    width: 75,
    height: 25,
    shaftLenPerc: 0.7,
    shaftHeiPerc: 0.2,
    polygonFill: "#000000",
    rectFill: "brown",
  });
  const vertical = new tl.VerticalSvg({
    width: 40,
    height: 200,
    viewBox: new tl.ViewBox({ topLeftX: 0, topLeftY: 0, bottomRightX: 40, bottomRightY: 200 }),
    lineWidth: 50, // same as svg width
    lineFill: "brown"
  });

  const longerArrow = new tl.LongArrowSvg({
    width: 100,
    height: 25,
    shaftLen: 75,
    shaftHei: 10,
    polygonFill: "#000000",
    rectFill: "brown",
  });

  const textArrow = new tl.TextArrow({
    arrow: arrow.svg,
    text: "This is a message"
  });


  const lollypop = new tl.LollypopSvg({
    circleRadius: 50,
    barWidth: 40,
    barHeight: 200,
    filling: "brown",
    text: "2026-10-30"
  });

  const littleBox = new tl.LittleBox({ text: "This is a box" });

  const row1 = new tl.TimelineRow({ middleElements: [lollypop] });
  const row2 = new tl.TimelineRow({ middleElements: [vertical], rightSideElements: [arrow] });
  const row3 = new tl.TimelineRow({ leftSideElements: [longerArrow.flip()], middleElements: [vertical] });
  const row4 = new tl.TimelineRow({ middleElements: [vertical], rightSideElements: [textArrow, littleBox] });

  const timelineRow = jQuery(`
    <div>
      ${row1.outerHtml()}
      ${row2.outerHtml()}
      ${row3.outerHtml()}
      ${row4.outerHtml()}
    </div>
  `)

  jQuery("#preview").append(timelineRow);
}