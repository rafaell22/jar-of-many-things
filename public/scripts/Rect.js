function fillRect() {}
function rotateRect() {}

export default class Rect {
    constructor(x, y, w, h, options) {
        const { mass, angle, fill, stroke, strokeWidth, isStatic } = options;
        const rotation = angle * Math.PI / 180;
        const body = new p2.Body({
          mass: isStatic ? 0 : mass,
          position: [x + w/2, y + h/2],
          angle: - rotation,
      });

      const shape = new p2.Box({ width: w, height: h });
        body.addShape(shape);

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.rotation = rotation
        this.body = body;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
      this.isStatic = isStatic;
    }

    update() {
      if(this.isStatic) {
        return;
      }
        this.x = this.body.interpolatedPosition[0];
        this.y = this.body.interpolatedPosition[1];
    }

    draw(ctx, screen) {
        const screenCoords = screen.worldToScreen([this.x, this.y]);

        this.rotateRect(ctx, screenCoords[0], screenCoords[1]);
        this.fillRect(ctx, screenCoords[0], screenCoords[1]);
        this.strokeRect(ctx, screenCoords[0], screenCoords[1]);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    strokeRect(ctx, x, y) {
      if (this.stroke) {
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.stroke;
        ctx.strokeRect(x, y - this.h, this.w, this.h);
      }
    }

    fillRect(ctx, x, y) {
      if (this.fill) {
        ctx.fillStyle = this.fill;
        ctx.fillRect(x, y - this.h, this.w, this.h);
      }
    }

    rotateRect(ctx, x, y) {
      if(this.rotation) {
        ctx.translate(x + this.w/2, y - this.h/2);
        ctx.rotate(this.rotation);
        ctx.translate(- x - this.w/2, - y + this.h/2);
      }
    }
}
