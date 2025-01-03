export default class Shape{
    constructor(x, y, options) {
        const { angle, fillStyle, strokeStyle, strokeWidth } = options;
        const rotation = angle * Math.PI / 180;

        this.x = x;
        this.y = y;
        this.rotation = rotation
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.strokeWidth = strokeWidth;
    }

    draw(screen) {
        this.rotate(screen);
        this.fill(screen);
        this.stroke(screen);
        screen.setTransform(1, 0, 0, 1, 0, 0);
    }

    rotate(screen) {}

    stroke(screen) {}

    fill(screen) {}

}
