export const loadImage = (src) => {
  console.log(`Loading image ${src}...`);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      console.log('Image loaded!');
      resolve(image);
    };

    image.src = src;
  });
}
