// @ts-check
export default class Plane {
    constructor(x, y, options = {}) {
        const { mass, stroke, strokeWidth, isStatic } = options;
        const body = new p2.Body({
          mass: isStatic ? 0 : mass,
          position: [ x, y ],
      });

      const shape = new p2.Plane();
        body.addShape(shape);

        this.x = x;
        this.y = y;
        this.body = body;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.isStatic = isStatic;
    }

    update() {}

    draw(ctx, screen) {
        const screenCoords = screen.worldToScreen([this.x, this.y]);
        if (this.stroke) {
          ctx.lineWidth = this.strokeWidth;
          ctx.strokeStyle = this.stroke;
          ctx.beginPath();
          ctx.moveTo(screenCoords[0] - 500, screenCoords[1]);
          ctx.lineTo(screenCoords[0] + 500, screenCoords[1]);
          ctx.stroke();
        }
    }
}
