import { radToDeg, isPointInCircle } from '../utils/geometry.js';
import Rect from './Rect.js';
import Body from './Body.js';
import EditPoint from './EditPoint.js';
import Screen from './Screen.js';
import Image from './Image.js';
import pubSub from './PubSub.js';
import Point from './Point.js';

const PART_WIDTH = 5;

export default class Jar {
  /**
   * @constructor
   * @param {Array<number[]>} coords
   * @param {p2.World} world
   * @param {object} imgConfig
   * @param {number} imgConfig.x
   * @param {number} imgConfig.y
   * @param {number} imgConfig.w
   * @param {number} imgConfig.h
   * @param {string} imgConfig.src
   * @param {number} [imgConfig.angle]
   */
  constructor(coords, world, imgConfig = {}) {
    this.coords = coords;
    this.parts = [];
    this.editPoints = [];
    this.isEditing = false;
    this.image = new Image(imgConfig.x, imgConfig.y, imgConfig.w, imgConfig.h, imgConfig.src, { angle: imgConfig.angle });
    this.image.load();
    this.calculateParts(world);
   }

  update() {
    this.parts.forEach(p => {
      p.body.update();
      p.shape.x = p.body.x;
      p.shape.y = p.body.y;
    });
  }

  /**
   * @param {Screen} screen
   */
  draw(screen) {
    if(this.image.loaded) {
      this.image.draw(screen);
    }

    if(this.isEditing) {
      this.parts.forEach(p => p.shape.draw(screen));
      this.editPoints.forEach(p => p.draw(screen));
    }
  }

  edit() {
    this.isEditing = true;
  }

  endEdit() {
    this.isEditing = false;
  }

  calculateParts(world) {
    // for each pair of coords[i] coords[i + 1]
    //   use line between points as centerline of rectangle
    //   calculate center of rectangle (rotated)
    //   calculate top left corner of unrotated rectangle
    let coords = this.coords;
    if(this.editPoints.length > 0) {
      coords = this.editPoints.map(ep => [ep.x, ep.y]);
    }

    this.parts.forEach(p => world.removeBody(p.body.body));

    this.editPoints = [];
    this.parts = [];

    for(let i = 0; i < coords.length - 1; i++) {
      const a = coords[i];
      const b = coords[i + 1];
      const ax = a[0];
      const ay = a[1];
      const bx = b[0];
      const by = b[1];
      let alpha = Math.atan(Math.abs(ax - bx)/Math.abs(ay - by));
      if(
        (ax > bx && ay < by) ||
        (ax < bx && ay > by)
      ) {
        alpha = -alpha;
      }
      
      const h = Math.sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
      const cx = Math.abs(ax - bx) / 2 + (ax > bx ? bx : ax);
      const cy = Math.abs(ay - by) / 2 + (ay > by ? by : ay);
      const ox = cx
      const oy = cy - h / 2

      // console.log(`a: ${a}, b: ${b}, cx: ${cx}, cy: ${cy}, ox: ${ox}, oy: ${oy}, w1: ${PART_WIDTH}, h: ${h}, alpha: ${alpha}`)
      const part = {
        shape: new Rect(ox, oy, PART_WIDTH, h, { isStatic: true, angle: radToDeg(alpha), strokeStyle: 'black', strokeWidth: 1, }),
        body: new Body(cx, cy, { isStatic: true, angle: radToDeg(alpha), }),
      };
      part.body.addShape(part.shape.shape);
      this.parts.push(part);
      world.addBody(part.body.body);

      this.editPoints.push(new EditPoint(ax, ay));
    }  

    const lastPoint = coords[coords.length - 1];
    this.editPoints.push(new EditPoint(lastPoint[0], lastPoint[1]));

    pubSub.publish('on-jar-updated', this.editPoints);
  }

  /**
    * @param {Point} point
    * @returns {number}
    */
  findEditPointIndex(point) {
    for(let i = 0; i < this.editPoints.length; i++) {
      const editPoint = this.editPoints[i];
      if(isPointInCircle(point, editPoint.shape)) {
        return i;
      }
    }
    return -1;
  }

  /**
    * @param {number} index
    */
  removePoint(index, world) {
    if(this.editPoints[index]) {
      this.editPoints.splice(index, 1);
      this.calculateParts(world);
    }
  }

  /**
    * @param {number} pointIndex
    * @param {number} dx
    * @param {number} dy
    */
  updatePoint(pointIndex, dx, dy) {
    const point = this.editPoints[pointIndex];
    if(point) {
      point.x += dx;
      point.y -= dy;
      point._shape.x += dx;
      point._shape.y -= dy;
    }
  }
}
