export const loadImage = (src) => {
  console.log(`Loading image ${src}...`);
  return new Promise((resolve, reject) => {
    const elImage = document.createElement('IMG');
    elImage.addEventListener('load', function() {
      console.log('Image loaded!');
      resolve(elImage);
    });
    elImage.addEventListener('error', function(errorLoadingImage) {
      console.log('Failed to load image!');
      console.log(errorLoadingImage.message);
      reject(errorLoadingImage);
    });
    elImage.src = src;
  });
}
