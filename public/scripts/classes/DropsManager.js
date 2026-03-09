// @ts-check

import Point from './Point.js';
import Drop, { DROP_TYPE } from './Drop.js';
import Screen from './Screen.js';
import DropArea from './DropArea.js';
import EditPoint from './EditPoint.js';
import { isValidHexColor, areColorsClose, mergeHexColors, COLOR_MERGING_TYPE } from '../utils/colors.js';
import { svgToPng } from '../utils/svgToImg.js';
import getButtonSvg from '../../assets/getButtonSvg.js';
import { randomIntBetween } from '../utils/math.js';
import {isPointInCircle} from '../utils/geometry.js';

const p2 = /** @type {object} */ (globalThis).p2;

export default class DropsManager {
  /**
   * @param {p2.World} world
   * @param {object} audio
   * @param {DropArea} [dropArea]
   */
  constructor(world, audio, dropArea) {
    this.drops = [];

    this.dropArea = dropArea;
    this.world = world;
    this.audio = audio;
    this.dropsConfig = {};
  }

  /**
   * @param {import('../types/drops.types.js').DropsConfig} dropsConfig
   */
  setDropsConfig(dropsConfig) {
    this.dropsConfig = dropsConfig;
  }

  /**
   * @param {DropArea} dropArea
   */
  setDropArea(dropArea) {
    this.dropArea = dropArea;
  }

  /**
   * @param {number} i
   */
  removeDropByIndex(i) {
    this.drops[i].remove(this.world);
  }

  /**
   * @param {number} i
   */
  getdropByIndex(i) {
    return this.drops[i];
  }

  editDropArea() {
    this.dropArea?.edit();
  }

  endDropAreaEdit() {
    this.dropArea?.endEdit();
  }

  /**
   * @param {Screen} screen
   * @param {object} imgCache
   */
  removeDropsOutsideScreen(screen, imgCache) {
    const dropsToRemove = [];
    for(let i = 0; i < this.drops.length; i++) {
      if(!screen.isObjectInsideScreen(this.drops[i].shape)) {
        this.removeDropByIndex(i);
        dropsToRemove.push(i);
        continue;
      } 

      this.drops[i].update();
    }


    dropsToRemove.forEach(i => {
      if(this.dropsConfig.recoverDrops) {
        const drop = this.getdropByIndex(i);
        if(drop?.canRetry()) {
          this.addDrop(imgCache, {
            color: drop.color,
            diameter: 2 * drop.shape.radius,
            retries: (drop.retries + 1),
          });
        }
      }
      this.drops.splice(i, 1)
    });

  }

  /**
    * @param {object} imgCache
    * @param {import('../types/drops.types.js').DropData} [data]
    */
  async addDrop(imgCache, data) {
    const diameter = data?.diameter ?? randomIntBetween(
      this.dropsConfig.diameter.min, 
      this.dropsConfig.diameter.max, 
      this.dropsConfig.diameter.distribution, 2);
    const dropPoint = data?.dropPoint ? new Point(data.dropPoint.x, data.dropPoint.y) : this.dropArea?.randomPoint();
    const dropColor = isValidHexColor(data?.color) ? 
      // @ts-ignore
      data.color : 
      '#eeeeee';
    let imgSource;
    if(imgCache[dropColor]) {
      imgSource = imgCache[dropColor];
    } else {
      imgSource = imgCache[dropColor] = await svgToPng(getButtonSvg(dropColor));
    }

    this.drops.push(
      new Drop(dropPoint?.x, dropPoint?.y, diameter, diameter, DROP_TYPE.CIRCLE, this.world, {x: 0, y: 0, w: diameter, h: diameter, src: imgSource}, dropColor, { mass: this.calculateDropMass(diameter), stroke: 'black', strokeWidth: 1, maxRadius: data?.maxRadius, retries: data?.retries, username: data?.username })
    );
  }

  /**
    * @param {number} diameter
    */
  calculateDropMass(diameter) {
    const MAXIMUM_MASS = 40;
    const mass = 0.025 * diameter * diameter;
    return Math.min(MAXIMUM_MASS, mass);
  }

  onDropCollision(imgCache, { bodyA, bodyB }) {
    let dropA;
    let dropIndexA = 0;
    let dropB;
    let dropIndexB = 0;

    for(let i = 0; i < this.drops.length; i++) {
      if(this.drops[i].body === bodyA) {
        dropA = this.drops[i];
        dropIndexA = i;
        continue;
      }

      if(this.drops[i].body === bodyB) {
        dropB = this.drops[i];
        dropIndexB = i;
      }

      if(dropA && dropB) {
        break;
      }
    }

    // only play for 1 drop at a time
    if(dropA) {
      const isDropATheLastDrop = dropIndexA === this.drops.length - 1;
      const canDropAStillPlayAudio = dropA.audioPlays > 0;
      if(
        isDropATheLastDrop && 
        canDropAStillPlayAudio
      ) {
        this.audio.play('collide');
        dropA.audioPlays--;
      } else if(dropB) {
        const isDropBTheLastDrop = dropIndexB === this.drops.length - 1;
        const canDropBStillPlayAudio = dropB.audioPlays > 0;
        if(
          dropB && 
          isDropBTheLastDrop &&
          canDropBStillPlayAudio
        ) {
          this.audio.play('collide');
          dropB.audioPlays--;
        }
      }
    }
    
    const isDropAColorHex = dropA?.color.substring(0, 1) === '#';
    const isDropBColorHex = dropB?.color.substring(0, 1) === '#';
    if(
      this.dropsConfig.mergeDrops &&
      isDropAColorHex &&
      isDropBColorHex &&
      areColorsClose(dropA.color, dropB.color)
    ) {
      this.drops.splice(dropIndexA, 1);
      this.drops.splice(dropIndexA < dropIndexB ? dropIndexB - 1 : dropIndexB, 1);
      dropA.remove(this.world);
      dropB.remove(this.world);

      // check which drop is bigger
      // add the new drop at the same location as the 
      //   bigger drop with the same diameter. Then, 
      //   make the drop grow until its diameter matches 
      //   the sum of the diameter of both drops
      const biggerDrop = dropA.shape.radius >= dropB.shape.radius ? dropA : dropB;
      this.addDrop(imgCache, {
        color: mergeHexColors(dropA.color, dropB.color, COLOR_MERGING_TYPE.AVERAGE),
        diameter: 2 * biggerDrop.shape.radius,
        dropPoint: {
          x: biggerDrop.x,
          y: biggerDrop.y
        },
        maxRadius: biggerDrop.shape.radius * 1.2,
      });
      this.audio.play('merge');
    }
  }

  reset() {
    this.drops.forEach((d) => {
      this.world.removeBody(d.body);
    });
    this.drops = [];
  }

  /**
   * @param {boolean} isEditing
   * @param {Screen} screen
   */
  draw(isEditing, screen) {
    if(isEditing) {
      this.dropArea?.draw(screen);
    }

    this.drops.forEach(d => {
      d.draw(screen);
    });
  }

  /**
   * @param {Point} point
   * @param {EditPoint} editPoint
   * @returns {boolean}
   */
  isPointInDropAreaEditpoint(point, editPoint) {
    return isPointInCircle(point, editPoint.shape);
  }

  /**
   * @param {Point} point
   * @returns {number}
   */
  getEditPointAtLocation(point) {
    for(let i = 0; i < this.dropArea?.editPoints.length; i++) {
      if(isPointInCircle(point, this.dropArea?.editPoints[i].shape)) {
        return i;
      }
    }

    return -1;
  }

  /**
   * @param {number} index
   * @returns {EditPoint}
   */
  getEditPointByIndex(index) {
    return this.dropArea?.editPoints[index];
  }

  /**
   * @param {EditPoint} updatedEditPoint
   * @param {number} editPointIndex
   *
   */
  onDropAreaEditPointMove(editPointIndex, updatedEditPoint) {
    this.dropArea?.updateEditPoint(editPointIndex, updatedEditPoint);
  }

  /**
   * @param {number} editPointIndex
   * @param {EditPoint} prevPoint
   */
  onCancelEditDropAreaEditPoint(editPointIndex, prevPoint) {
    this.dropArea?.updateEditPoint(editPointIndex, prevPoint);
  }
}
