import {RANDOM_DISTRIBUTION} from '../utils/math.js';
import {DROP_TYPE} from './Drop.js';
import pubSub from './PubSub.js';

const DEFAULT_CONFIG = {
  jar: {
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
  },
  dropArea: {
    coords: [
      [427, 500],
      [573, 500],
      [573, 600],
      [427, 600],
    ],
  },
  drops: [{
    type: DROP_TYPE.CIRCLE,
    diameter: {
      min: 10,
      max: 80,
      distribution: RANDOM_DISTRIBUTION.NORMAL,
    },
    image: {x: 0, y: 0, w: 10, h: 10, src: `./assets/button_blue.png`}
  }],
  chromaColor: '#00b140',
  uiColor: '#d4ce46',
};

export default class DataManagement {
  constructor() {
    this.config = null;
    this.loadedConfig = false;
    this.load();
  }

  async load() {
    try {
      this.config = await window.electronApi.loadSettings();
    } catch(errorLoadingConfig) {
      console.log('errorLoadingConfig!');
      console.log(errorLoadingConfig);
    }

    if(!this.config) {
      this.config = DEFAULT_CONFIG;
      this.save(this.config);
    }

    pubSub.publish('on-config-loaded', this.config);

    pubSub.subscribe('on-drop-area-updated', this.onDropAreaUpdated.bind(this));
    pubSub.subscribe('on-jar-updated', this.onJarUpdated.bind(this));
    pubSub.subscribe('on-change-min-diameter', this.onDropUpdated.bind(this))
    pubSub.subscribe('on-change-max-diameter', this.onDropUpdated.bind(this))
    pubSub.subscribe('on-change-diameter-distribution', this.onDropUpdated.bind(this))
  }

  save() {
    window.electronApi.saveSettings(this.config);
  }

  onDropAreaUpdated(dropAreaPoints) {
    this.config.dropArea.coords = dropAreaPoints.map(p => [p.x, p.y]);
  }

  onJarUpdated(jarPoints) {
    this.config.jar.coords = jarPoints.map(p => [p.x, p.y]);
  }

  onDropUpdated(diameterConfig) {
    this.config.drops[0].diameter.min = diameterConfig.minDiameter ?? this.config.drops[0].diameter.min;
    this.config.drops[0].diameter.max = diameterConfig.maxDiameter ?? this.config.drops[0].diameter.max;
    this.config.drops[0].diameter.distribution = diameterConfig.diameterDistribution ?? this.config.drops[0].diameter.distribution;
  }
}
