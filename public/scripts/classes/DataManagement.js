import {DROP_TYPE} from './Drop.js';

const DEFAULT_CONFIG = {
  jars: [{
    name: 'default',
    coords: [
      [100, 160], 
      [90, 140], 
      [90, 50], 
      [210, 50],
      [210, 140],
      [200, 160],
    ],
    image: {
      x: 150, 
      y: 50, 
      w: 120, 
      h: 120, 
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
    this.config = this.load('config');
    if(!this.config) {
      this.config = DEFAULT_CONFIG;
      this.save('config', this.config);
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
