import Screen from './Screen.js';
import Shape from './Shape.js';
import Point from './Point.js';

export default class Polygon extends Shape {
  /**
    * @param {Point[]} coords
    * @param {object} options
    * @param {number} [options.angle]
    * @param {string} [options.fillStyle]
    * @param {string} [options.strokeStyle]
    * @param {number} [options.strokeWidth]
    */
  constructor(coords, options) {
    super(0, 0, options);
    this.coords = coords;
  }

  /**
    * @param {Screen} screen
    */
  stroke(screen) {
    if(this.strokeStyle) {
      screen.strokePolygon(this.coords, this.strokeStyle, this.strokeWidth);
    }
  }

  /**
    * @param {Screen} screen
    */
  fill(screen) {
    if(this.fillStyle) {
      screen.fillPolygon(this.coords, this.fillStyle);
    }
  }
}
