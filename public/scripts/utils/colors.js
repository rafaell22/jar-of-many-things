function rgbToHex(r, g, b) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

/**
  * @param {string} h1 - in hex format "#000000"
  * @param {string} h2 - in hex format
  * @param {number} [threshhold] - in terms of hue
  * @returns {boolean}
  */
function areColorsClose(h1, h2, threshhold = 5) {
  const hue1 = parseInt("0x" + h1.substring(1, 3), 16);
  const hue2 = parseInt("0x" + h2.substring(1, 3), 16);

  if(Math.abs(hue1 - hue2) <= threshhold) {
    return true;
  }

  return false;
}

export {
    rgbToHex,
    areColorsClose,
}
