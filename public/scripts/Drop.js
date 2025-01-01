import Body from "./Body";
import Circle from "./Circle";

export const DROP_TYPE = {
  RECT: 'RECT',
  CIRCLE: 'CIRCLE',
}

export default class Drop {
  constructor(x, y, w, h, type, options) {
    this._body = new Body(x, y, options);

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

    this._body.addShape(this.shape);
  }

  get body() {
    return this._body.body;
  }
}
