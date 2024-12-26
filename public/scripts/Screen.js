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
}
