import { SECOND } from '../utils/time.js';
import Body from './Body.js';
import Circle from './Circle.js';
import Image from './Image.js';
import Screen from './Screen.js';

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
const RADIUS_INCREASE_RATE = 1.05;
const MAX_RETRIES = 2;
const MAX_COLLISION_AUDIO_PLAYS = 10;
const TIME_TO_SHOW_USERNAME = 5 * SECOND; // ms
const USERNAME_FONT_SIZE = 32;

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
   * @param {number} [optiothisArgns.maxRadius]
   * @param {number} [options.retries]
   * @param {string} [options.username]
   */
  constructor(x, y, w, h, type, world, imgConfig, color, options = {}) {
    this._body = new Body(x, y, options);
    this.image = new Image(x + imgConfig.x, y + imgConfig.y, imgConfig.w, imgConfig.h, imgConfig.src, { angle: imgConfig.angle });
    this.image.load();
    this.type = type;
    this.color = color;
    this.maxRadius = options.maxRadius;
    this.retries = options.retries ?? 0;
    this.audioPlays = MAX_COLLISION_AUDIO_PLAYS;

    switch(type) {
      case DROP_TYPE.CIRCLE:
        this.shape = new Circle(x, y + w / 2 , w / 2, options);
        break;
    }

    this._body.addShape(this.shape.shape);
    world.addBody(this.body);

    this.isActive = true;

    this.username = options.username;
    setTimeout((() => this.username = null).bind(this), TIME_TO_SHOW_USERNAME)
  }

  canRetry() {
    return this.retries < MAX_RETRIES;
  }

  get body() {
    return this._body.body;
  }

  get x() {
    return this.shape.x;
  }

  set x(x) {
    this._body.x = this.shape.x = this.image.x = x;
  }

  get y() {
    return this.shape.y;0.
  }

  set y(y) {
    this._body.y = this.shape.y = y;
    this.image.y = this.type === DROP_TYPE.CIRCLE ? y - this.shape.radius : y;
  }

  update() {
    if(!this.isActive) {
      return;
    }

    this._body.update();

    if(this.maxRadius) {
      this.shape.radius = Math.min(this.shape.radius * RADIUS_INCREASE_RATE, this.maxRadius);
      this.image.w = 2 * this.shape.radius;
      this.image.h = 2 * this.shape.radius;
      this._body.y += 2;

      if(this.shape.radius >= this.maxRadius) {
        this.maxRadius = null;
      }
    }

    this.x = this._body.x;
    this.y = this._body.y;

    this.image.rotation = this._body.rotation;
  }

  /**
    * @param {Screen} screen
    */
  draw(screen) {
    if(!this.isActive) {
      return;
    }

    // this.shape.draw(screen);
    if(this.image.loaded) {
      this.image.draw(screen);
    }

    if(this.username) {
      screen.strokeText(this.x + this.shape.radius + 5, this.y - this.shape.radius, this.username, { fontSize: USERNAME_FONT_SIZE, fontColor: '#000000' });
      screen.fillText(this.x + this.shape.radius + 5, this.y - this.shape.radius, this.username, { fontSize: USERNAME_FONT_SIZE, fontColor: '#000000' });
    }
  }

  remove(world) {
    world.removeBody(this.body);
    this.isActive = false;
  }
}
