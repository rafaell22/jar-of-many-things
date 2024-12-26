export default class Circle {
    constructor(x, y, radius, options = {}) {
        const { mass, rotation, fill, stroke, strokeWidth } = options;
        const body = new p2.Body({
          mass: mass ?? 2,
          position: [x, y]
      });

        const shape = new p2.Circle({ radius: radius ?? 10 });
        body.addShape(shape);

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.body = body;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
    }

    update() {
        this.x = this.body.interpolatedPosition[0];
        this.y = this.body.interpolatedPosition[1];
    }

    draw(ctx, screen) {
        const screenCoords = screen.worldToScreen([this.x, this.y]);

        ctx.beginPath()
        ctx.arc(screenCoords[0], screenCoords[1], this.radius, 0, 2 * Math.PI, false)
        if (this.fill) {
            ctx.fillStyle = this.fill
            ctx.fill()
        }
        if (this.stroke) {
            ctx.lineWidth = this.strokeWidth
            ctx.strokeStyle = this.stroke
            ctx.stroke()
        }
    }
}
