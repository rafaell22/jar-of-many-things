import Hsl from '../classes/Hsl.js';
import Rgb from '../classes/Rgb.js';

/**
  * @param {string} h1 - in hex format "#000000"
  * @param {string} h2 - in hex format
  * @param {number} [threshhold] - in terms of hue
  * @returns {boolean}
  */
function areColorsClose(h1, h2, threshhold = 5) {
  const color1 = Rgb.fromHex(h1);
  const color2 = Rgb.fromHex(h2);

  const hsl1 = color1.toHsl();
  const hsl2 = color2.toHsl();

  if(Math.abs(hsl1.h - hsl2.h) <= threshhold) {
    return true;
  }

  return false;
}

const COLOR_MERGING_TYPE = {
  KEEP_FIRST: 'FIRST',
  KEEP_SECOND: 'SECOND',
  AVERAGE: 'AVERAGE_ALL',
};

/**
  * @param {string} h1 - in hex format "#000000"
  * @param {string} h2 - in hex format
  * @returns {string}
  */
function mergeHexColors(h1, h2, mergingType = COLOR_MERGING_TYPE.KEEP_FIRST) {
  switch(mergingType) {
    case COLOR_MERGING_TYPE.KEEP_FIRST:
      return h1;
    case COLOR_MERGING_TYPE.KEEP_SECOND:
      return h2;
    case COLOR_MERGING_TYPE.AVERAGE:
      const hsl1 = Rgb.fromHex(h1).toHsl();
      const hsl2 = Rgb.fromHex(h2).toHsl();

      const averageHsl = new Hsl(
        Math.round((hsl1.h + hsl2.h) / 2),
        Math.round((hsl1.s + hsl2.s) / 2),
        Math.round((hsl1.l + hsl2.l) / 2),
      );

      return averageHsl.toRgb().toHex();
  }
}

/**
 * @param {string|null} [value]
 * @returns {boolean}
 */
function isValidHexColor(value) {
  return value && (/#[a-fA-F0-9]{6}/.test(value));
}

export {
    areColorsClose,
    COLOR_MERGING_TYPE,
    mergeHexColors,
    isValidHexColor,
}
