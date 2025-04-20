import Rgb from './Rgb.js';

export default class Hsl {
  constructor(h, s, l) {
    this.h = h;
    this.s = s;
    this.l = l;
  }

  toString() {
    return `hsl(${this.h},${this.s}%,${this.l}%)`;
  }

  toRgb() {
    const sFraction = this.s / 100;
    const lFraction = this.l / 100;

    const c = (1 - Math.abs(2 * lFraction - 1)) * sFraction;
    const x = c * (1 - Math.abs((this.h / 60) % 2 - 1));
    const m = lFraction - c/2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (0 <= this.h && this.h < 60) {
      r = c; g = x; b = 0;  
    } else if (60 <= this.h && this.h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= this.h && this.h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= this.h && this.h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= this.h && this.h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= this.h && this.h < 360) {
      r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return new Rgb(r, g, b);
  }
}
