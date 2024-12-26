// @ts-check

const resizeButton = document.getElementById('resize');
export function initResizeEvent() {
    resizeButton?.addEventListener('click', () => {
        window.resizeTo(550, 150);
    });
}
