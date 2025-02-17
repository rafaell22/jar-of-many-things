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

  strokeLine(x1, y1, x2, y2, strokeStyle, strokeWidth) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.lineWidth = strokeWidth;
    this.ctx.stroke()
  }

  fillText(x, y, content) {
    const screenCoords = this.worldToScreen(x, y);
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(content, screenCoords[0], screenCoords[1])
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
  
  drawImage(image, x, y, w, h) {
    const screenCoords = this.worldToScreen([ x, y ]);
    this.ctx.drawImage(image, screenCoords[0] - w / 2, screenCoords[1] - h, w, h);
  }
}
