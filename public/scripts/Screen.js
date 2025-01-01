export default class Screen {
  constructor(w, h, bg, ctx) {
    this.w = w;
    this.h = h;
    this.bg = bg;
    this.ctx = ctx;

}

  clear() {
    this.ctx.fillStyle = this.bg;
    this.ctx.fillRect(0, 0, this.w, this.h);
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
    this.ctx.strokeRect(screenCoords[0], screenCoords[1] - h, w, h);
  }

  fillRect(x, y, w, h, fillStyle) {
    const screenCoords = this.worldToScreen([x, y])

    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(screenCoords[0], screenCoords[1] -h, w, h);
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
    this.ctx.translate(screenCoords + w/2, screenCoords[1] - h/2);
    ctx.rotate(rotation);
    ctx.translate(- screenCoords[0] - w/2, - screenCoords[1] + h/2);
  }
}
