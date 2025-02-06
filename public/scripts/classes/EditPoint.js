import Body from './Body.js';
import Circle from './Circle.js';

const EDIT_POINT_RADIUS = 10;
const EDIT_POINT_FILL_STYLE = 'rgba(255, 255, 255, 0.5)';
const EDIT_POINT_STROKE_STYLE = 'red';
const EDIT_POINT_STROKE_WIDTH = 2;

export default class EditPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this._shape = new Circle(x, y, EDIT_POINT_RADIUS, {
      fillStyle: EDIT_POINT_FILL_STYLE,
      strokeStyle: EDIT_POINT_STROKE_STYLE,
      strokeWidth: EDIT_POINT_STROKE_WIDTH,
    });
  }

  draw(screen) {
    this._shape.draw(screen);
  }

  get shape() {
    return this._shape;
  }
}
