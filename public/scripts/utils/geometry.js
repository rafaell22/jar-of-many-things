import Point from '../classes/Point.js';
import Circle from '../classes/Circle.js';
import Vector2 from '../classes/Vector2.js';
import Vector3 from '../classes/Vector2.js';
import Rect from '../classes/Rect.js';

import { determinant } from './math.js';

/**
 * @param {number} deg - angle in degrees
 * @returns {number} - angle in radians
 */
export const degToRad = (deg) => deg * Math.PI / 180;

/**
 * @param {number} rad - angle in rad
 * @returns {number} - angle in degres
 */
export const radToDeg = (rad) => rad * 180 / Math.PI;

/**
 * @param {Point} p1
 * @param {Point} p2
 * @returns {number}
 */
export const distanceBetweenPoints = (p1, p2) => Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));

/**
 * @param {Point} p
 * @param {Circle} c
 * @returns {boolean}
 */
export const isPointInCircle = (p, c) => distanceBetweenPoints(p, new Point(c.x, c.y)) <= c.radius;

/**
 * @param {Point} p
 * @param {Rect} r
 * @returns {boolean}
 */
export const isPointInRect = (p, r) => p.x > (r.x - r.w/2) && 
    p.x < (r.x + r.w/2) &&
    p.y > r.y &&
    p.y < r.y + r.h;

/**
 * @param {Point} p - point being rotated
 * @param {Point} c - point/center to rotate aroung
 * @param {number} r - rotation (counter-clockwise) in radians
 */
export const rotateAround = (p, c, r) => new Point(Math.cos(r)*(p.x - c.x) - Math.sin(r)*(p.y - c.y) + c.x, Math.sin(r)*(p.x - c.x) + Math.cos(r)*(p.y - c.y) + c.y);

/**
    * @param {Point[]} coords
    * @param {Point} p
    */
export const isPointInQuadrilateral = (coords, p) => {
    if(coords.length !== 4) {
        throw new Error(`isPointInQuadrilateral - can't calculate with ${coords.length} points`);
    }

    const vp = new Vector2(p.x, p.y);
    const v1 = new Vector2(coords[0].x, coords[0].y);
    const v2 = new Vector2(coords[1].x, coords[1].y);
    const v3 = new Vector2(coords[2].x, coords[2].y);
    const v4 = new Vector2(coords[3].x, coords[3].y);

    const cp1 = v2.minus(v1).crossProduct(vp.minus(v1));
    const cp2 = v3.minus(v2).crossProduct(vp.minus(v2));
    const cp3 = v4.minus(v3).crossProduct(vp.minus(v3));
    const cp4 = v1.minus(v4).crossProduct(vp.minus(v4));

    return (cp1 > 0 && cp2 > 0 && cp3 > 0 && cp4 > 0) ||
        (cp1 < 0 && cp2 < 0 && cp3 < 0 && cp4 < 0);
}

export const barycentric = (v1, v2, v3, p) => {
	const delta = determinant(new Vector3(v1.x, v1.y, 1), new Vector3(v2.x, v2.y, 1), new Vector3(v3.x, v3.y, 1));
  const alpha = determinant(new Vector3(p.x, p.y, 1), new Vector3(v2.x, v2.y, 1), new Vector3(v3.x, v3.y, 1))/delta;
  const beta = determinant(new Vector3(v1.x, v1.y, 1), new Vector3(p.x, p.y, 1), new Vector3(v3.x, v3.y, 1))/delta;
  const gama = determinant(new Vector3(v1.x, v1.y, 1), new Vector3(v2.x, v2.y, 1), new Vector3(p.x, p.y, 1))/delta;
  
  return new Vector3(alpha, beta, gama);
}

export const getConvexPolygon = (coords) => {
  const v1 = new Vector2(coords[0].x, coords[0].y);
  const v2 = new Vector2(coords[1].x, coords[1].y);
  const v3 = new Vector2(coords[2].x, coords[2].y);
  const v4 = new Vector2(coords[3].x, coords[3].y);
	
  const ab = v2.minus(v1);
  const bc = v3.minus(v2);
  
  if(ab.crossProduct(bc) == 0) {
  	return null;
  }
  
  const bary = barycentric(v1, v2, v3, v4);
  
  if(bary.x < 0 && bary.y > 0 && bary.z > 0) {
  	return [v1, v2, v4, v3];
  }
  
  if(bary.x > 0 && bary.y < 0 && bary.z > 0) {
  	return [v1, v2, v3, v4];
  }
  
  if(bary.x > 0 && bary.y > 0 && bary.z < 0) {
  	return [v1, v4, v2, v3];
  }
  
  return null;
}

/**
 * @param {Circle} c
 * @param {Rect} r
 * @returns {boolean}
 */
  export const isCircleInRect = (c, r) => (c.x + 2 * c.radius) > (r.x - r.w / 2) ||
  (c.x - 2 * c.radius) < (r.x + r.w / 2) ||
  (c.y + 2 * c.radius) > (r.y) ||
  (c.y - 2 * c.radius) < (r.y + r.h);
