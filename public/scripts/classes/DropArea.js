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
    this.updateMinMaxValues();
  }

  updateMinMaxValues() {
    this.xMin = this.editPoints.reduce((min, c) => min > c.x ? c.x : min, this.editPoints[0].x);
    this.xMax = this.editPoints.reduce((max, c) => max < c.x ? c.x : max, 0);
    this.yMin = this.editPoints.reduce((min, c) => min > c.y ? c.y : min, this.editPoints[0].y);
    this.yMax = this.editPoints.reduce((max, c) => max < c.y ? c.y : max, 0);
  }

  /**
    * @param {Screen} screen
    */
  draw(screen) {
    this.shape.draw(screen);
    if(this.isEditing) {
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
      if(isPointInQuadrilateral(this.editPoints, point)) {
        return point;
      }
    }

    // if not able to find a valid point in 1000 iterations, return the centroid
    return new Point((this.xMax - this.xMin) + this.xMin, (this.yMax - this.yMin) + this.yMin);
  }

  /**
    * @param {number} index
    * @param {EditPoint} editPoint
    */
  updateEditPoint(index, editPoint) {
    this.editPoints[index].x = editPoint.x;
    this.editPoints[index].y = editPoint.y;
    this.shape.coords[index].x = editPoint.x;
    this.shape.coords[index].y = editPoint.y;
    this.updateMinMaxValues();
  }
}
