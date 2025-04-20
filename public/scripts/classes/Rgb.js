import Hsl from './Hsl.js';

export default class Rgb {
  /**
    * @param {number} r - 0 to 255
    * @param {number} g - 0 to 255
    * @param {number} b - 0 to 255
    */
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  /**
    * @returns {string}
    */
  toString() {
    return `rgb(${this.r},${this.g},${this.b})`;
  }

  /**
    * @returns {string}
    */
  toHex() {
    return "#" + (1 << 24 | this.r << 16 | this.g << 8 | this.b).toString(16).slice(1);
  }

  static fromHex(hex) {
    let r = 0, g = 0, b = 0;

    // 3 digits
    if (hex.length == 4) {
      r = "0x" + hex[1] + hex[1];
      g = "0x" + hex[2] + hex[2];
      b = "0x" + hex[3] + hex[3];
    // 6 digits
    } else if (hex.length == 7) {
      r = "0x" + hex[1] + hex[2];
      g = "0x" + hex[3] + hex[4];
      b = "0x" + hex[5] + hex[6];
    }
  
    return new Rgb(+r, +g, +b);
  }

  toHsl() {
    // Make r, g, and b fractions of 255
    const rFraction = this.r / 255;
    const gFraction = this.g / 255;
    const bFraction = this.b / 255;

    // Find greatest and smallest channel values
    const cmin = Math.min(rFraction,gFraction,bFraction);
    const cmax = Math.max(rFraction,gFraction,bFraction);
    const delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;

    // Calculate hue
    // No difference
    if (delta === 0) {
      h = 0;
    }
    // Red is max
    else if (cmax === rFraction) {
      h = ((gFraction - bFraction) / delta) % 6;
    }
    // Green is max
    else if (cmax === gFraction) {
      h = (bFraction - rFraction) / delta + 2;
    }
    // Blue is max
    else {
      h = (rFraction - gFraction) / delta + 4;
    }

    h = Math.round(h * 60);
      
    // Make negative hues positive behind 360°
    if (h < 0) {
        h += 360;
    }

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      
    // Multiply l and s by 100
    // s = +(s * 100).toFixed(1);
    // l = +(l * 100).toFixed(1);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return new Hsl(h, s, l);
  }
}
