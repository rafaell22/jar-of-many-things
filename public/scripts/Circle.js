import Shape from "./Shape.js";

export default class Circle extends Shape {
    constructor(x, y, radius, options = {}) {
        super(x, y, options);
        this.radius = radius;
        this.shape = new p2.Circle({ radius: radius });
    }

    fill(screen) {
        if (this.fill) {
            screen.fillCircle(this.x, this.y, this.radius, this.fillStyle);
        }
    }

    stroke(screen) {
        if (this.stroke) {
            screen.strokeCircle(this.x, this.y, this.radius, this.strokeStyle, this.strokeWidth);
        }
    }

    rotate(screen) {
      if(this.rotation) {
        screen.rotate(this.rotation, this.x, this.y, 2 * this.radius, 2 * this.radius)
      }
    }
}
