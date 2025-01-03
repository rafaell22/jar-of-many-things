import {radToDeg} from './geometry.js';
import Rect from './Rect.js';
import Body from './Body.js';

export default class Jar {
  constructor(x, y, w, h, coords, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.coords = coords;
    this.parts = [];

    // for each pair of coords[i] coords[i + 1]
    //   use line between points as centerline ofmrectangle
    //   calculate center of rectangle (rotated)
    //   calculate top left corner of unrotated rectangle
    const w1 = 5;
    for(let i = 0; i < coords.length - 1; i++) {
      const a = coords[i];
      const b = coords[i + 1];
      const ax = a[0];
      const ay = a[1];
      const bx = b[0];
      const by = b[1];
      const alpha = Math.atan((ax - bx)/(ay - by))
      const h = Math.sin(alpha) / (ay - by)
      const cx = Math.sin(alpha) * h / 2 + bx
      const cy = Math.cos(alpha) * w1 / 2 + by
      const ox = cx
      const oy = cy - h / 2

      const part = {
        shape: new Rect(ox, oy, w1, h, { isStatic: true, angle: radToDeg(alpha), strokeStyle: 'black', strokeWidth: 1, }),
        body: new Body(cx, cy, { isStatic: true, angle: radToDeg(alpha), }),
      };
      part.body.addShape(part.shape.shape);
      this.parts.push(part);
    }  
  }

  update() {
    this.parts.forEach(p => {
      p.body.update();
      p.shape.x = p.body.x;
      p.shape.y = p.body.y;
    });
  }

  draw(screen) {
    this.parts.forEach(p => {
      p.shape.draw(screen);
    });
  }
}

// alpha = atan((ax - bx)/(ay - by))
// h = sin(alpha) / (ay - by)

// center of rectangle:
// cx = sin(alpha) * h / 2 + bx
// cy = cos(alpha) * w / 2 + by

// top left corner with no rotation:
// ox = cx - w / 2
// oy = cy - h / 2
//
// bottom center no rotation
// ox = cx
// oy = cy - h / 2

/*
}
*/
