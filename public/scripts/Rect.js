import Shape from './Shape.js';

export default class Rect extends Shape {
    constructor(x, y, w, h, options) {
        super(x, y, options);

        this.w = w;
        this.h = h;
        this.shape = new p2.Box({ width: w, height: h });
    }

    stroke(screen) {
      if (this.strokeStyle) {
        screen.strokeRect(this.x, this.y, this.w, this.h, this.strokeStyle, this.strokeWidth);
      }
    }

    fill(screen) {
      if (this.fillStyle) {
        screen.fillRect(this.x, this.y, this.w, this.h, this.fillStyle);
      }
    }

    rotate(screen) {
      // return;
      if(this.rotation) {
        screen.rotate(this.rotation, this.x, this.y, this.w, this.h);
      }
    }
}
