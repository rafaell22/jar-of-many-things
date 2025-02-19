import {isPointInQuadrilateral} from '../utils/geometry.js';
import {randomIntBetween} from '../utils/math.js';
import EditPoint from './EditPoint.js';
import Point from './Point.js';
import Polygon from './Polygon.js';
import Screen from './Screen.js';

const MAX_RANDOM_ITERATIONS = 1000;

export default class DropArea {
  constructor(coords) {
    this.shape = new Polygon(coords, { strokeStyle: 'red', strokeWidth: 1 });
    this.editPoints = coords.map(c => new EditPoint(c.x, c.y));
    this.isEditing = false;
    this.xMin = coords.reduce((min, c) => min > c.x ? c.x : min, coords[0].x);
    this.xMax = coords.reduce((max, c) => max < c.x ? c.x : max, 0);
    this.yMin = coords.reduce((min, c) => min > c.y ? c.y : min, coords[0].y);
    this.yMax = coords.reduce((max, c) => max < c.y ? c.y : max, 0);
  }

  /**
    * @param {Screen} screen
    */
  draw(screen) {
    if(this.isEditing) {
      this.shape.draw(screen);
      this.editPoints.forEach(p => {
        p.draw(screen);
      });
    }
  }

  edit() {
    this.isEditing = true;
  }

  endEdit() {
    this.isEditing = false;
  }

  /**
    * @returns {Point}
    */
  randomPoint() {
    for(let i = 0; i < MAX_RANDOM_ITERATIONS; i++) {
      const x = randomIntBetween(this.xMin, this.xMax);
      const y = randomIntBetween(this.yMin, this.yMax);

      const point = new Point(x, y);
      if(isPointInQuadrilateral(this.coords, point)) {
        return point;
      }
    }

    // if not able to find a valid point in 1000 iterations, return the centroid
    return new Point((this.xMax - this.xMin) + this.xMin, (this.yMax - this.yMin) + this.yMin);
  }
}
