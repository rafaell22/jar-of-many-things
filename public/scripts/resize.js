// @ts-check

const resizeButton = document.getElementById('resize');
export function initResizeEvent(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    resizeButton?.addEventListener('click', () => {
        window.resizeTo(550, 150);
    });

    window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}
