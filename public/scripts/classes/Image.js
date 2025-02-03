import {loadImage} from '../utils/loadData.js';

export default class Image {
    constructor(x, y, w, h, src, options = {}) {
        const { angle } = options;
        const rotation = angle * Math.PI / 180;

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.rotation = rotation
        this.src = src;
        this.loaded = false;
    }

    async load(cb) {
        try {
            this.image = await loadImage(this.src);
        } catch(errorLoadingImage) {
            throw errorLoadingImage;
        }

        this.loaded = true;
        if(cb) {
            cb();
        }
    }

    draw(screen) {
        this.rotate(screen);
        screen.drawImage(this.image, this.x, this.y, this.w, this.h);
        screen.setTransform(1, 0, 0, 1, 0, 0);
    }

    rotate(screen) {
      if(this.rotation) {
        screen.rotate(this.rotation, this.x, this.y, this.w, this.h);
      }
    }
}
