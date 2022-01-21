const AVERAGE_CHAR_PIXEL_WIDTH = 7.3796 * 1.05;  

import UbuntuCharWidthMap from "./UbuntuCharWidthMap";  
import _ from "lodash";
import { FONT_SIZE } from "../constants";
  
// Calculates the width of a single word
// You should not need to modify this function.
const calcWordWidth = (word) => {
  const w = _.reduce(
    word.split(""),
    (sum, c) => {
      /* eslint-disable no-control-regex */
      if (/[\x00-\x1F]/.test(c)) {
        // non-printable character
        return sum;
      }
      const w = UbuntuCharWidthMap[c] || UbuntuCharWidthMap["x"];
      return sum + w;
    },
    0
  );
  return w;
};

// Calculates the width and height of a paragraph of text,
// including any word wrapping required to fit inside maxWidth.
// You should not need to modify this function.
const calcTextSize = (text, maxWidth) => {
  const spaceWidth = UbuntuCharWidthMap[" "];

  if (!text) {
    return {width: 0, height: 0};
  }

  let safeText = _.deburr(text);
  let words = safeText.match(/\S+/g);
  if (!words) {
    words = [];
  }
  let wordWidths = words.map(w => {
    return calcWordWidth(w);
  });
  let wordCount = words.length,
    maxCharsPerLine = Math.floor(maxWidth / AVERAGE_CHAR_PIXEL_WIDTH),
    lines = [],
    line = "",
    lineLen = 0,
    maxLineWidth = 0,
    lineCount = 0,
    i = 0;

  while (i < wordCount) {
    if (lineLen + wordWidths[i] < maxWidth) {
      line += words[i] + " ";
      lineLen += wordWidths[i] + spaceWidth;
      i++;
    } else if (lineLen === 0) {
      let word = words[i],
        wordLen = word.length;
      for (let j = 0; j < wordLen; j += maxCharsPerLine) {
        lines.push(word.slice(j, j + maxCharsPerLine));
        lineCount++;
        maxLineWidth = maxWidth;
      }
      i++;
    } else {
      lines.push(line);
      lineCount++;
      if (lineLen > maxLineWidth) {
        maxLineWidth = lineLen;
      }
      line = "";
      lineLen = 0;
    }
  }
  if (lineLen > 0) {
    lines.push(line);
    lineCount++;
    if (lineLen > maxLineWidth) {
      maxLineWidth = lineLen;
    }
  }
  const lineHeight = FONT_SIZE;
  return {
      width: maxLineWidth,
      height: lineCount * lineHeight
  };
};
  
export default calcTextSize;