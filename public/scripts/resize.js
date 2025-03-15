// @ts-check

export function initResizeEvent(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}
