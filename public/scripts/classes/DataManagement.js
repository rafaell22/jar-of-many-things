import {DROP_TYPE} from './Drop.js';

const DEFAULT_CONFIG = {
  jars: [{
    name: 'default',
    coords: [
      [424, 480],
      [429, 450], 
      [396, 427], 
      [394, 276], 
      [428, 259],
      [500, 252],
      [570, 260],
      [603, 279],
      [607, 421],
      [572, 450],
      [577, 480],
    ],
    image: {
      x: 500, 
      y: 250, 
      w: 240, 
      h: 240, 
      src: './assets/jar.png',
    }
  }],
  drops: [{
    type: DROP_TYPE.CIRCLE,
    radius: {
      min: 10,
      max: 30,
    },
    image: {x: 0, y: 0, w: 10, h: 10, src: `./assets/button_blue.png`}
  }],
  chromaColor: '#00b140',
  uiColor: '#d4ce46',
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
