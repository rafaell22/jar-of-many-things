// @ts-check
import DataManagement from './DataManagement.js';
import Jar from './Jar.js';
import Drop from './Drop.js';
import { DROP_TYPE } from './Drop.js';
import Point from './Point.js';
import EditPoint from './EditPoint.js';
import Audio from './Audio.js';

import Ws from './Ws.js';
import Screen from './Screen.js';
import pubSub from './PubSub.js';

import { start } from '../mainloop.js';
import { randomIntBetween } from '../utils/math.js'
import { isPointInCircle, isPointInRect, rotateAround } from '../utils/geometry.js';
import { initResizeEvent } from '../resize.js';
import DropArea from './DropArea.js';
import {initSettings} from '../settings.js';
import {initFooter} from '../footer.js';
import {svgToPng} from '../utils/svgToImg.js';
import getButtonSvg from '../../assets/getButtonSvg.js';
import {areColorsClose, rgbToHex} from '../utils/colors.js';

const p2 = /** @type {object} */ (globalThis).p2;

const MOUSE_BUTTONS = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2,
};

export default class Main {
  constructor() {
    this.drops = [];
    this.isEditing = false;

    this.canvas = /** @type {HTMLCanvasElement|null} */ (document.getElementById('world'));
    this.ctx;
    if(this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    } else {
      throw new Error('Canvas not found!');
    }

    // this.screen = new Screen(this.canvas.width, this.canvas.height, '#00b140', this.ctx);
    this.screen = new Screen(window.innerWidth, window.innerHeight, '#00b140', this.ctx);
    this.world = new p2.World({gravity: [0, -50], sleepMode: p2.World.BODY_SLEEPING, });
    this.world.defaultContactMaterial.restitution = 0.3;

    this.currentJar = null;

    this.FIXED_TIME_STEP = 1 / 60; // seconds
    this.MAX_SUB_STEPS = 10; // Max sub steps to catch up with the wall clock

    this.dataManagement = new DataManagement();
    this.configLoadedSub = pubSub.subscribe('on-config-loaded', this.onConfigLoaded.bind(this));

    this.buttonImgCache = {};

    this.audio = new Audio(['button-drop', 'button-merge']);
  }

  onConfigLoaded() {
    const jarConfig = this.dataManagement.config.jar;
    this.currentJar = new Jar(jarConfig?.coords ?? [], this.world, jarConfig?.image);
    this.dropArea = new DropArea(this.dataManagement.config.dropArea.coords.map(p => new Point(p[0], p[1])))
    this.initEditEventListeners();
    this.initWebsockets();
    initResizeEvent(this.canvas);
    initSettings(this.dataManagement.config);
    initFooter();

    pubSub.unsubscribe('on-config-loaded', this.configLoadedSub);

    start(this.start.bind(this));
  }

  /**
   * @param {number} dt - time in milliseconds since last execution
   */
  start(dt) {
    // Move bodies forward in time
    this.world.step(this.FIXED_TIME_STEP, dt / 1000, this.MAX_SUB_STEPS);

    const dropsToRemove = [];
    for(let i = 0; i < this.drops.length; i++) {
      if(!this.screen.isObjectInsideScreen(this.drops[i].shape)) {
        this.drops[i].remove(this.world);
        dropsToRemove.push(i);
        continue;
      } 

      this.drops[i].update();
    }


    dropsToRemove.forEach(i => {
      if(this.dataManagement.config.recoverDrops) {
        const drop = this.drops[i];
        if(drop?.canRetry()) {
          this.addDrop({
            color: drop.color,
            diameter: 2 * drop.shape.radius,
            retries: (drop.retries + 1),
          });
        }
      }
      this.drops.splice(i, 1)
    });
    this.screen.clear();
    this.draw();
  };

  draw() {
    if(this.isEditing) {
      this.screen.drawGrid();
      this.dropArea?.draw(this.screen);
    }
    this.drops.forEach(d => {
      d.draw(this.screen);
    });
    this.currentJar?.draw(this.screen);
  }

  /**
    * @param {object} [data]
    * @param {string} data.color
    * @param {number} [data.diameter]
    * @param {object} [data.dropPoint]
    * @param {number} data.dropPoint.x
    * @param {number} data.dropPoint.y
    * @param {number} [data.maxRadius]
    * @param {number} [data.retries]
    */
  async addDrop(data) {
    const diameter = data?.diameter ?? randomIntBetween(
      this.dataManagement.config.drops[0].diameter.min, 
      this.dataManagement.config.drops[0].diameter.max, 
      this.dataManagement.config.drops[0].diameter.distribution, 2);
    const dropPoint = data?.dropPoint ? new Point(data.dropPoint.x, data.dropPoint.y) : this.dropArea?.randomPoint();
    const buttonColor = data?.color || rgbToHex(randomIntBetween(0, 255), randomIntBetween(0, 255), randomIntBetween(0, 255));
    let buttonImgSrc;
    if(this.buttonImgCache[buttonColor]) {
      buttonImgSrc = this.buttonImgCache[buttonColor];
    } else {
      buttonImgSrc = this.buttonImgCache[buttonColor] = await svgToPng(getButtonSvg(buttonColor));
    }
    const drop = new Drop(dropPoint.x, dropPoint.y, diameter, diameter, DROP_TYPE.CIRCLE, this.world, {x: 0, y: 0, w: diameter, h: diameter, src: buttonImgSrc}, buttonColor, { mass: 40/((50 - diameter) / 5.71 + 1) , stroke: 'black', strokeWidth: 1, maxRadius: data?.maxRadius, retries: data?.retries });
    this.drops.push(drop);
  }

  initWebsockets() {
    this.ws = new Ws();
    this.ws.connect({
      drop: {
        event: 'drop',
        cb: this.addDrop.bind(this),
      }
    });
  }

  addNewPointToJar(index, point) { 
    this.currentJar?.editPoints.splice(index, 0, new EditPoint(point.x, point.y));
    this.currentJar?.calculateParts(this.world)
  }

  /**
    * @param {number} pointIndex
    * @param {number} button
    */
  handleClickOnJarEditPoint(pointIndex, button) {
    if(button === MOUSE_BUTTONS.RIGHT) {
      this.currentJar?.removePoint(pointIndex, this.world);
      return;
    }

    if(button === MOUSE_BUTTONS.LEFT) {
      this.canvas.onpointermove = ((event) => this.currentJar?.updatePoint(pointIndex, event.movementX, event.movementY)).bind(this);

      this.canvas.onpointerup = () => {
        this.canvas.onpointermove = this.canvas.onpointerup = this.canvas.onpointerout = this.canvas.onpointerleave = this.canvas.onpointercancel = null;
        this.currentJar?.calculateParts(this.world);
      };

      this.canvas.onpointerout = this.canvas.onpointerleave = this.canvas.onpointercancel = () => {
        // discard changes
        this.canvas.onpointermove = this.canvas.onpointerup = this.canvas.onpointerout = this.canvas.onpointerleave = this.canvas.onpointercancel = null;
      }
      return;
    }
  }

  onClickCanvas(clickEvent) {
      // check if click is on jar edit point
      const eventPoint = this.screen.worldToScreen([clickEvent.offsetX, clickEvent.offsetY]);
      const jarPointIndex = this.currentJar?.findEditPointIndex(new Point(...eventPoint));
      if(jarPointIndex !== undefined && jarPointIndex >= 0) {
        this.handleClickOnJarEditPoint(jarPointIndex, clickEvent.button);
        return;
      }

      let rectBeingEditedIndex;
      for(let i = 0; i < (this.currentJar?.parts.length ?? 0); i++) {
        const rect = this.currentJar?.parts[i].shape;
        const point = new Point(...eventPoint);
        const rotatedPoint = rotateAround(point, new Point(rect.x, rect.y + rect.h/2), rect.rotation || 0);
        if(isPointInRect(rotatedPoint, rect)) {
          rectBeingEditedIndex = i;
        }
      }

      if(rectBeingEditedIndex) {
        this.addNewPointToJar(rectBeingEditedIndex + 1, new Point(eventPoint[0], eventPoint[1]));
        return;
      }

      let isDropAreaBeingEdited = false;
      let editPointIndex = 0;
      for(let i = 0; i < this.dropArea?.editPoints.length; i++) {
        const editPoint = this.dropArea?.editPoints[i];
        if(isPointInCircle(new Point(...eventPoint), editPoint.shape)) {
          isDropAreaBeingEdited = true;
          editPointIndex = i;
        }
      }

      if(isDropAreaBeingEdited) {
        this.addEditPointerEventListeners(this.dropArea?.editPoints[editPointIndex]);

        const onEditMoveSub = pubSub.subscribe('edit-point-move', (updatedEditPoint) => {
          this.dropArea?.updateEditPoint(editPointIndex, updatedEditPoint);
        }); 

        const onEditCancelSub = pubSub.subscribe('edit-point-cancel', (prevPoint) => {
          this.dropArea?.updateEditPoint(editPointIndex, prevPoint);
          pubSub.unsubscribe('edit-point-move', onEditMoveSub);
          pubSub.unsubscribe('edit-point-cancel', onEditCancelSub);
          pubSub.unsubscribe('edit-point-end', onEditEndSub);
        });

        const onEditEndSub = pubSub.subscribe('edit-point-end', () => {
          pubSub.unsubscribe('edit-point-move', onEditMoveSub);
          pubSub.unsubscribe('edit-point-cancel', onEditCancelSub);
          pubSub.unsubscribe('edit-point-end', onEditEndSub);
        });
      }
  }

  initEditEventListeners() {
    this.canvas.onpointerdown = this.onClickCanvas.bind(this); 
    this.canvas.onpointerdown = this.onClickCanvas.bind(this); 
    pubSub.subscribe('on-edit-jar', this.onEdit.bind(this));
    pubSub.subscribe('on-cancel-edit-jar', this.onCancel.bind(this));
    pubSub.subscribe('on-save-settings', this.onSaveSettings.bind(this));
    pubSub.subscribe('on-reset-jar', this.onReset.bind(this));
    pubSub.subscribe('on-drop', this.onDrop.bind(this));
    pubSub.subscribe('change-chroma-color', this.updateScreenBackground.bind(this));

    this.world.on('impact', ({ bodyA, bodyB }) => {
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
      //if(dropA?.isFirstImpact) {
      if(dropA && dropIndexA === this.drops.length - 1) {
        this.audio.play('button-drop');
        dropA.isFirstImpact = false;
      // } else if(dropB?.isFirstImpact) {
      } else if(dropB && dropIndexB === this.drops.length - 1) {
        this.audio.play('button-drop');
        dropB.isFirstImpact = false;
      }
      
      if(
        dropA?.color.substring(0, 1) === '#' &&
        dropB?.color.substring(0, 1) === '#' &&
        areColorsClose(dropA.color, dropB.color)
      ) {
        dropA.remove(this.world);
        dropB.remove(this.world);
        this.drops.splice(dropIndexA, 1);
        this.drops.splice(dropIndexA < dropIndexB ? dropIndexB - 1 : dropIndexB, 1);

        // check which button is bigger
        // add the new button at the same location as the 
        //   bigger button with the same diameter. Then, 
        //   make the button grow until its diameter matches 
        //   the sum of the diameter of both buttons
        const biggerDrop = dropA.shape.radius >= dropB.shape.radius ? dropA : dropB;
        this.addDrop({
          color: dropA.color,
          diameter: 2 * dropA.shape.radius,
          dropPoint: {
            x: biggerDrop.x,
            y: biggerDrop.y
          },
          maxRadius: dropA.shape.radius + dropB.shape.radius,
        });
        this.audio.play('button-merge');
      }
    });

    //@ts-ignore
    document.querySelector('#minimize-window').onclick = window.electronApi.minimizeWindow;
    //@ts-ignore
    document.querySelector('#maximize-window').onclick = window.electronApi.maximizeWindow;
    //@ts-ignore
    document.querySelector('#close-window').onclick = window.electronApi.closeWindow;
  }

  onEdit() {
    this.canvas?.classList.add('edit');

    this.currentJar?.edit();
    this.dropArea?.edit();
    this.isEditing = true;
    this.draw();
  }

  onCancel() {
    this.canvas?.classList.remove('edit');
    
    this.isEditing = false;
    this.currentJar?.endEdit();
    this.dropArea?.endEdit();
  }

  onSaveSettings() {
    this.dataManagement.save();
  }

  onReset() {
    this.drops.forEach((d) => {
      this.world.removeBody(d.body);
    });
    this.drops = [];
  }

  onDrop() {
    this.addDrop();
  }

  /**
    * @param {string} color
    */
  updateScreenBackground(color) {
    this.screen.bg = color;
  }

  /**
    * @param {EditPoint} editPoint
    */
  addEditPointerEventListeners(editPoint) {
    const point = new EditPoint(editPoint.x, editPoint.y);
    const originalPoint = new EditPoint(editPoint.x, editPoint.y);
    this.canvas.onpointermove = (event) => {
      // console.log(event)
      point.x += event.movementX;
      point.y -= event.movementY;

      pubSub.publish('edit-point-move', point);
    }

    this.canvas.onpointerup = () => {
      this.canvas.onpointermove = this.canvas.onpointerup = this.canvas.onpointerout = this.canvas.onpointerleave = this.canvas.onpointercancel = null;
      pubSub.publish('edit-point-end', point);
    }

    this.canvas.onpointerout = this.canvas.onpointerleave = this.canvas.onpointercancel = () => {
      this.canvas.onpointermove = this.canvas.onpointerup = this.canvas.onpointerout = this.canvas.onpointerleave = this.canvas.onpointercancel = null;
      pubSub.publish('edit-point-cancel', originalPoint);
    }
  }
}
