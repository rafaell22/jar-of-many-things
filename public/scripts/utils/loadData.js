export const loadImage = (src) => {
  console.log(`Loading image ${src}...`);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      console.log('Image loaded!');
      resolve(image);
    };
    /*
    elImage.addEventListener('error', function(errorLoadingImage) {
      console.log('Failed to load image!');
      console.log(errorLoadingImage.message);
      reject(errorLoadingImage);
    });
    */
    image.src = src;
  });
}
