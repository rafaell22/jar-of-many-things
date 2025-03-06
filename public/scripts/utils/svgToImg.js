import {loadImage} from './loadData.js';

const svgToPng = async (svgString) => {
    const svgUrl = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml' }));
    const svgImage = await loadImage(svgUrl);

    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const context = canvas.getContext('2d');
    context.drawImage(svgImage, 0, 0);
    const imgData = canvas.toDataURL('image/png');

    return imgData;
}

export {
    svgToPng,
};
