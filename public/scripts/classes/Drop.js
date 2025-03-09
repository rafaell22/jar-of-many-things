import Body from './Body.js';
import Circle from './Circle.js';
import Image from './Image.js';

/**
 * @readonly
 * @enum {string}
 */
export const DROP_TYPE = {
  RECT: 'RECT',
  CIRCLE: 'CIRCLE',
}

const DEFAULT_MASS = 15;
const DEFAULT_STROKE = 'black';
const DEFAULT_STROKE_WIDTH = 1;

export default class Drop {
  /**
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @param {DROP_TYPE} type
   * @param {p2.World} world
   * @param {object} imgConfig
   * @param {number} imgConfig.x - relative to the shape's origin
   * @param {number} imgConfig.y - relative to the shape's origin
   * @param {number} imgConfig.w
   * @param {number} imgConfig.h
   * @param {string} imgConfig.src
   * @param {number} [imgConfig.angle]
   * @param {object} [options]
   * @param {number} options.mass
   * @param {number} [options.angle]
   * @param {boolean} [options.isStatic]
   * @param {string} [options.stroke]
   * @param {number} [options.strokeWidth]
   */
  constructor(x, y, w, h, type, world, imgConfig, options = {}) {
    this._body = new Body(x, y, options);
    this.image = new Image(x + imgConfig.x, y + imgConfig.y, imgConfig.w, imgConfig.h, imgConfig.src, { angle: imgConfig.angle });
    this.image.load();
    this.type = type;

    switch(type) {
      case DROP_TYPE.RECT:
        this.shape = new Rect(x, y, w, h, options);
        break;
      case DROP_TYPE.CIRCLE:
        this.shape = new Circle(x, y + w / 2 , w / 2, options);
        break;
    }

    this._body.addShape(this.shape.shape);
    world.addBody(this.body);
  }

  get body() {
    return this._body.body;
  }

  update() {
    this._body.update();
    this.shape.x = this.image.x = this._body.x;
    this.shape.y = this._body.y;
    this.image.y = this.type === DROP_TYPE.CIRCLE ? this._body.y - this.shape.radius : this._body.y;

    this.image.rotation = this._body.rotation;
  }

  draw(screen) {
    this.shape.draw(screen);
    if(this.image.loaded) {
      this.image.draw(screen);
    }
  }

  remove(world) {
    world.removeBody(this.body);
  }
}
