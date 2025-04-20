import Circle from '../public/scripts/classes/Circle.js';
import Rect from '../public/scripts/classes/Rect.js';
import Rgb from '../public/scripts/classes/Rgb.js';
import Hsl from '../public/scripts/classes/Hsl.js';

import {isCircleInRect} from '../public/scripts/utils/geometry.js';
import * as p2 from '../public/scripts/libraries/p2.min.js';
import { randomIntBetween } from '../public/scripts/utils/math.js';
import {areColorsClose} from '../public/scripts/utils/colors.js';

const toRawType = (value) => {
  let _toString = Object.prototype.toString;
  
  let str = _toString.call(value)

  return str.slice(8, -1)
}

class Validator {
  constructor(value) {
    this.value = value;
  }

  toBe(value) {
    if(value === undefined) {
      return this;
    }

    const result = Validator.isEqual(this.value, value);
    if(result) {
      return this;
    }

    throw new Error(`    Expected ${value}, but got ${this.value}`);
  }

  static isEqual(a, b) {
    switch(toRawType(a)) {
      case 'String':
      case 'Number':
      case 'Boolean':
      case 'Undefined':
      case 'Null':
      case 'Function': 
        return a === b;
      case 'Array':
      case 'Object':
        return JSON.stringify(a) === JSON.stringify(b);
    }

    return false;
  }
}

const expect = (value) => {
  return new Validator(value);
};

/**
 * @param {string} description
 * @param {Function} cb
 */
const describe = (description, cb) => {
  console.log(description);
  cb();
}

/**
 * @param {string} description
 * @param {Function} test
 */
const it = (description, test) => {
  console.log('|-' + description);
  try {
    test();
    console.log('| |-Passed');
  } catch(error) {
    console.log('| |-Failed');
    console.log(error);
  }
}

describe('isCircleInRect', () => {
  it('when circle is in rect, then return true', () => {
    const screen = new Rect(100, 0, 200, 200, {});
    const circle1 = new Circle(100, 100, 10, {});
    const circle2 = new Circle(100, 200, 10, {});
    const circle3 = new Circle(100, 205, 10, {});
    const circle4 = new Circle(100, 0, 10, {});
    const circle5 = new Circle(100, -5, 10, {});
    const circle6 = new Circle(0, 100, 10, {});
    const circle7 = new Circle(-5, 100, 10, {});
    const circle8 = new Circle(5, 100, 10, {});
    
    expect(isCircleInRect(circle1, screen)).toBe(true);
    expect(isCircleInRect(circle2, screen)).toBe(true);
    expect(isCircleInRect(circle3, screen)).toBe(true);
    expect(isCircleInRect(circle4, screen)).toBe(true);
    expect(isCircleInRect(circle5, screen)).toBe(true);
    expect(isCircleInRect(circle6, screen)).toBe(true);
    expect(isCircleInRect(circle7, screen)).toBe(true);
    expect(isCircleInRect(circle8, screen)).toBe(true);
  });

  it('when circle is outside rect, then return false', () => {
    const screen = new Rect(100, 0, 200, 200, {});
    const circle1 = new Circle(100, 300, 10, {});
    const circle2 = new Circle(100, -50, 10, {});
    const circle3 = new Circle(-50, 100, 10, {});
    const circle4 = new Circle(300, 100, 10, {});

    expect(isCircleInRect(circle1, screen)).toBe(false);
    expect(isCircleInRect(circle2, screen)).toBe(false);
    expect(isCircleInRect(circle3, screen)).toBe(false);
    expect(isCircleInRect(circle4, screen)).toBe(false);
  })
});

describe('Rgb', () => {
  describe('instantiate', () => {
    it('when instantiated, then create Rgb instance', () => {
      const r = randomIntBetween(0, 255);
      const g = randomIntBetween(0, 255);
      const b = randomIntBetween(0, 255);
      const rgb = new Rgb(r, g, b);

      expect(rgb.r).toBe(r);
      expect(rgb.g).toBe(g);
      expect(rgb.b).toBe(b);
    });
  })

  describe('toString', () => {
    it('when parsed to string, then return string in format rgb(r,g,b)', () => {
      const r = randomIntBetween(0, 255);
      const g = randomIntBetween(0, 255);
      const b = randomIntBetween(0, 255);
      const rgb = new Rgb(r, g, b);

      expect(rgb.toString()).toBe(`rgb(${r},${g},${b})`);
    });
  });

  describe('toHex', () => {
    it('when parsed to hex, then return string in format #rrggbb', () => {
      const rgb = new Rgb(29, 28, 40);

      expect(rgb.toHex()).toBe('#1d1c28');
    });
  });

  describe('toHsl', () => {
    it('when parsed to Hsl, then return Hsl instance', () => {
      const rgb = new Rgb(135, 176, 217);
      const hsl = rgb.toHsl();

      expect(hsl.h).toBe(210);
      expect(hsl.s).toBe(52);
      expect(hsl.l).toBe(69);
    });
  });

  describe('fromHex', () => {
    it('when a hex string is received, then returns Rgb instance', () => {
      const h = '#c8dc19';
      const rgb = Rgb.fromHex(h);

      expect(rgb.r).toBe(200);
      expect(rgb.g).toBe(220);
      expect(rgb.b).toBe(25);
    });
  });
});

describe('Hsl', () => {
  describe('instantiate', () => {
    it('when instantiated, then create Hsl instance', () => {
      const h = randomIntBetween(0, 360);
      const s = randomIntBetween(0, 100);
      const l = randomIntBetween(0, 100);
      const hsl = new Hsl(h, s, l);

      expect(hsl.h).toBe(h);
      expect(hsl.s).toBe(s);
      expect(hsl.l).toBe(l);
    });
  })

  describe('toString', () => {
    it('when parsed to string, then return string in format hsl(h,s%,l%)', () => {
      const h = randomIntBetween(0, 360);
      const s = randomIntBetween(0, 100);
      const l = randomIntBetween(0, 100);
      const hsl = new Hsl(h, s, l);

      expect(hsl.toString()).toBe(`hsl(${h},${s}%,${l}%)`);
    });
  });

  describe('toRgb', () => {
    it('when parsed to Rgb, then return Rgb instance', () => {
      const hsl = new Hsl(210, 52, 69);
      const rgb = hsl.toRgb();

      expect(rgb.r).toBe(135);
      expect(rgb.g).toBe(176);
      expect(rgb.b).toBe(217);
    });
  });
});

describe('Color Utils', () => {
  it('areColorsClose', () => {
    it('when color hues difference is less than the threshhold, then return true', () => {
      const h1 = '#c8c814';
      const h2 = '#404018';
      const h3 = '#73b41e';
      const h4 = '#587818';

      expect(areColorsClose(h1, h2)).toBe(true);
      expect(areColorsClose(h3, h4, 10)).toBe(true);
    });

    it('when color hues difference is more than the threshhold, then return false', () => {
      const h1 = '#c8c814';
      const h3 = '#73b41e';
      const h4 = '#587818';

      expect(areColorsClose(h1, h3, 5)).toBe(false);
      expect(areColorsClose(h3, h4, 5)).toBe(false);
    });
  });
});


