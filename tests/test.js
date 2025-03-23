import Circle from '../public/scripts/classes/Circle.js';
import Rect from '../public/scripts/classes/Rect.js';
import {isCircleInRect} from '../public/scripts/utils/geometry.js';
import * as p2 from '../public/scripts/libraries/p2.min.js';

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


