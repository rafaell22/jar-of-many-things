import Body from "./Body.js";
import Circle from "./Circle.js";

export const DROP_TYPE = {
  RECT: 'RECT',
  CIRCLE: 'CIRCLE',
}

export default class Drop {
  constructor(x, y, w, h, type, options) {
    this._body = new Body(x, y, options);
    console.log('type: ', type);

    switch(type) {
      case DROP_TYPE.RECT:
        this._body = new Body(x, y, options);
        this.shape = new Rect(x, y, w, h, options);
        break;
      case DROP_TYPE.CIRCLE:
        this._body = new Body(x, y, options);
        this.shape = new Circle(x, y, w / 2, options);
        break;
    }

    this._body.addShape(this.shape.shape);
  }

  get body() {
    return this._body.body;
  }

  update() {
    this._body.update();
    this.shape.x = this._body.x;
    this.shape.y = this._body.y;
  }

  draw(screen) {
    this.shape.draw(screen);
  }
}
