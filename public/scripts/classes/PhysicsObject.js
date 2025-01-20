import Shape from './Shape.js';

export default class PhysicsObject extends Shape {
    constructor(x, y, w, h, options) {
        const { mass, angle, fill, stroke, strokeWidth, isStatic } = options;
        super(x, y, w, h, { fill, stroke, strokeWidth });
        const body = new p2.Body({
          mass: isStatic ? 0 : mass,
          position: [x + w/2, y + h/2],
          angle: - rotation,
      });

      this.rotation = rotation
      this.body = body;
      this.isStatic = isStatic;
    }

    update() {
        if(this.isStatic) {
          return;
        }
        this.x = this.body.interpolatedPosition[0];
        this.y = this.body.interpolatedPosition[1];
    }
}
