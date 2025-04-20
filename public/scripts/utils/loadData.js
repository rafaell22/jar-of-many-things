export const loadImage = (src) => {
  //console.log(`Loading image ${src}...`);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      //console.log('Image loaded!');
      resolve(image);
    };

    image.src = src;
  });
}

export const convertBlobToBase64 = async (blob) => {
  return new Promise((resolve, reject) => {
  	const reader = new FileReader();
  	reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export const loadImageBlob = async (src) => {
	try {
		const response = await fetch(src);
  	const blob = await response.blob();
		return blob;
	} catch(errorLoadingBlob) {
  	console.log('Error loading image blob!');
  	throw errorLoadingBlob;
  }
}

export const loadImageUrl = async (src) => {
	try {
  	const blob = await loadImageBlob(src);
    return URL.createObjectURL(blob);
	} catch(errorLoadingUrl) {
  	console.log('Error loading url!');
  	throw errorLoadingUrl;
  }
}

const imgCache = {};
export const getFromCacheOrDownload = async (url) => {
  const cachedImg = imgCache[url];

  if (cachedImg) {
    return cachedImg;
  }
  
  const localCachedImage = localStorage.getItem(url);

  if(localCachedImage) {
  	return localCachedImage;
  }

  const imageBlob = await loadImageBlob(url);
  const base64Img = await convertBlobToBase64(imageBlob);
  localStorage.setItem(url, base64Img);
  imgCache[url] = base64Img;
  
  return base64Img;
}
