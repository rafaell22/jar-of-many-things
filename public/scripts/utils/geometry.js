import Point from '../classes/Point.js';
import Circle from '../classes/Circle.js';

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
