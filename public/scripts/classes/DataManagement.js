import {DROP_TYPE} from './Drop.js';

const DEFAULT_CONFIG = {
  jars: [{
    name: 'default',
    coords: [
      [79, 250], 
      [46, 227], 
      [44, 76], 
      [78, 59],
      [150, 52],
      [220, 60],
      [253, 79],
      [257, 221],
      [222, 250],
    ],
    image: {
      x: 150, 
      y: 50, 
      w: 240, 
      h: 240, 
      src: '/jar/assets/jar.png',
    }
  }],
  drops: [{
    type: DROP_TYPE.CIRCLE,
    radius: {
      min: 10,
      max: 30,
    },
    image: {x: 0, y: 0, w: 10, h: 10, src: `/jar/assets/button_blue.png`}
  }],
  chromaColor: '#00b140',
  currentJar: null,
};

export default class DataManagement {
  constructor() {
    // this.config = this.load('config');
    this.config = null;
    if(!this.config) {
      this.config = DEFAULT_CONFIG;
      this.save('config', this.config, true);
    }
  }

  load(key) {
    const data = localStorage.getItem(key);

    if(!data) {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch(error) {
      return data;
    }
  }

  save(key, data, overwrite) {
    if(this.load(key)) {
      if(!overwrite) {
        throw new Error(`Value found for key ${key}`);
      }
    }

    localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
  }
}
