export default class Body {
    constructor(x, y, options) {
      const { mass, angle, isStatic } = options;
      const rotation = angle * Math.PI / 180;

      const body = new p2.Body({
        mass: isStatic ? 0 : mass,
        position: [x, y],
        angle: - rotation,
      });

      this.x = x;
      this.y = y;
      this.rotation = rotation
      this.body = body;
      this.isStatic = isStatic;
    }

    addShape(shape) {
      this.body.addShape(shape);
    }

    update() {
      if(this.isStatic) {
        return;
      }
      this.x = this.body.interpolatedPosition[0];
      this.y = this.body.interpolatedPosition[1];
    }
}
