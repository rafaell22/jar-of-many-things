import {isCircleInRect} from '../utils/geometry.js';
import Circle from './Circle.js';
import Rect from './Rect.js';
import Image from './Image.js';

const DEFAULT_FONT_FILL = 'black';
const DEFAULT_FONT_STRIKE = 'white';
const DEFAULT_FONT_WIDTH = 3;

export default class Screen {
  constructor(w, h, bg, ctx) {
    this.w = w;
    this.h = h;
    this.bg = bg;
    this.ctx = ctx;
}

  clear() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    // this.ctx.fillStyle = this.bg;
    // this.ctx.fillRect(0, 0, this.w, this.h);
  }

  worldToScreen(point) {
    return [ point[0], this.h - point[1] ];
  }

  get lineWidth() { return this.ctx.lineWidth; }
  set lineWidth(lineWidth) { 
    this.ctx.lineWidth = lineWidth;
  }

  get strokeStyle() { return this.ctx.strokeStyle; }
  set strokeStyle(strokeStyle) { 
    this.ctx.strokeStyle = strokeStyle;
  }

  strokeRect(x, y, w, h, strokeStyle, strokeWidth) {
    const screenCoords = this.worldToScreen([x, y])
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineWidth = strokeWidth;
    this.ctx.strokeRect(screenCoords[0] - w / 2, screenCoords[1] - h, w, h);
  }

  fillRect(x, y, w, h, fillStyle) {
    const screenCoords = this.worldToScreen([x, y])

    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(screenCoords[0] - w / 2, screenCoords[1] - h, w, h);
  }

  fillCircle(x, y, r, fillStyle) {
    const screenCoords = this.worldToScreen([x, y])
    this.ctx.beginPath()
    this.ctx.arc(screenCoords[0], screenCoords[1], r, 0, 2 * Math.PI, false)
    this.ctx.fillStyle = fillStyle;
    this.ctx.fill()
  }

  strokeCircle(x, y, r, strokeStyle, strokeWidth) {
    const screenCoords = this.worldToScreen([x, y]);
    this.ctx.beginPath()
    this.ctx.arc(screenCoords[0], screenCoords[1], r, 0, 2 * Math.PI, false)
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineWidth = strokeWidth;
    this.ctx.stroke()
  }

  rotate(rotation, x, y, w, h) {
    const screenCoords = this.worldToScreen([x, y]);
    this.ctx.translate(screenCoords[0], screenCoords[1] - h/2);
    this.ctx.rotate(rotation);
    this.ctx.translate(- screenCoords[0], - screenCoords[1] + h/2);
  }

  setTransform(...args) {
    this.ctx.setTransform(...args);
  }

  /**
    * @param {number} x1
    * @param {number} y1
    * @param {number} x2
    * @param {number} y2
    * @param {string} strokeStyle
    * @param {number} strokeWidth
    */
  strokeLine(x1, y1, x2, y2, strokeStyle, strokeWidth) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineWidth = strokeWidth;
    this.ctx.stroke()
  }

  /**
    * @param {Point[]} coords
    * @param {string} strokeStyle
    * @param {number} strokeWidth
    */ 
  strokePolygon(coords, strokeStyle, strokeWidth) {
    this.ctx.beginPath();
    for(let i = 0; i < coords.length; i++) {
      const screenCoords = this.worldToScreen([coords[i].x, coords[i].y]);
      if(i === 0) {
        this.ctx.moveTo(screenCoords[0], screenCoords[1]);
        continue;
      }

      this.ctx.lineTo(screenCoords[0], screenCoords[1]);
    }
    const screenCoords = this.worldToScreen([coords[0].x, coords[0].y]);
    this.ctx.lineTo(screenCoords[0], screenCoords[1]);

    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineWidth = strokeWidth;
    this.ctx.stroke();
  }

  /**
    * @param {Point[]} coords
    * @param {string} fillStyle
    */ 
  fillPolygon(coords, fillStyle) {
    this.ctx.beginPath();
    for(let i = 0; i < coords.length; i++) {
      const screenCoords = this.worldToScreen([coords[i].x, coords[i].y]);
      if(i === 0) {
        this.ctx.moveTo(screenCoords[0], screenCoords[1]);
        continue;
      }

      this.ctx.lineTo(screenCoords[0], screenCoords[1]);
    }
    const screenCoords = this.worldToScreen([coords[0].x, coords[0].y]);
    this.ctx.lineTo(screenCoords[0], screenCoords[1]);

    this.ctx.fillStyle = fillStyle;
    this.ctx.fill();
  }

  /**
    * @param {number} x
    * @param {number} y
    * @param {string} content
    * @param {object} [options]
    * @param {number} [options.fontSize]
    * @param {string} [options.fontColor]
    */
  fillText(x, y, content, options = {}) {
    const screenCoords = this.worldToScreen([x, y]);
    this.ctx.font = `${ options.fontSize ?? 48 }px "Roboto"`;
    this.ctx.fillStyle = `${ options.fontSize ?? DEFAULT_FONT_FILL }`;
    this.ctx.fillText(content, screenCoords[0], screenCoords[1])
  }

  /**
    * @param {number} x
    * @param {number} y
    * @param {string} content
    * @param {object} [options]
    * @param {number} [options.fontSize]
    * @param {string} [options.fontColor]
    * @param {number} [options.fontWidth]
    */
  strokeText(x, y, content, options = {}) {
    const screenCoords = this.worldToScreen([x, y]);
    this.ctx.font = `${ options.fontSize ?? 48 }px "Roboto"`;
    this.ctx.strokeStyle = `${ options.fontColor ?? DEFAULT_FONT_STRIKE }`;
    this.ctx.lineWidth = options.fontWidth ?? DEFAULT_FONT_WIDTH;
    this.ctx.strokeText(content, screenCoords[0], screenCoords[1])
  }

  drawGrid() {
    for(let j = 0; j < this.h; j += 100) {
      const screenCoords1 = this.worldToScreen([0, j]);
      const screenCoords2 = this.worldToScreen([this.w, j]);
      this.strokeLine(screenCoords1[0], screenCoords1[1], screenCoords2[0], screenCoords2[1], 'black', 1);
      // this.fillText(0, j, `${j}`);
    }

    for(let i = 0; i < this.w; i += 100) {
      const screenCoords1 = this.worldToScreen([i, 0]);
      const screenCoords2 = this.worldToScreen([i, this.h]);
      this.strokeLine(screenCoords1[0], screenCoords1[1], screenCoords2[0], screenCoords2[1], 'black', 1);
      // this.fillText(i, 0, `${i}`);
    }
  }
  
  /**
    * @param {Image} image
    * @param {number} x
    * @param {number} y
    * @param {number} w
    * @param {number} h
    */
  drawImage(image, x, y, w, h) {
    const screenCoords = this.worldToScreen([ x, y ]);
    this.ctx.drawImage(image, screenCoords[0] - w / 2, screenCoords[1] - h, w, h);
  }

  /**
    * @param {Shape} shape
    * @returns {boolean}
    */
  isObjectInsideScreen(shape) {
    switch(true) {
      case (shape instanceof Circle):
        return isCircleInRect(shape, new Rect(this.w / 2, 0, this.w, this.h, {}));
    }

    return true;
  }
}
