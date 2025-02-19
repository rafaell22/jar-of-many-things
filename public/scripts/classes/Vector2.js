export default class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
    * @description Returns a new Vector2
    * @param {Vector2} v
    * @returns {Vector2}
    */
  minus(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /**
    * @param {Vector2} v
    * @returns {number}
    */
  crossProduct(v) {
    return this.x * v.y - v.x * this.y;
  }
}
