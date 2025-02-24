// @ts-check
import DataManagement from './DataManagement.js';
import Jar from './Jar.js';
import Drop from './Drop.js';
import { DROP_TYPE } from './Drop.js';
import Point from './Point.js';
import EditPoint from './EditPoint.js';

import Ws from './Ws.js';
import Screen from './Screen.js';
import pubSub from './PubSub.js';

import { start } from '../mainloop.js';
import { randomIntBetween, RANDOM_DISTRIBUTION } from '../utils/math.js'
import { isPointInCircle, isPointInRect, rotateAround } from '../utils/geometry.js';
import { initResizeEvent } from '../resize.js';
import DropArea from './DropArea.js';
import {initSettings} from '../settings.js';
import {initFooter} from '../footer.js';

const p2 = /** @type {object} */ (globalThis).p2;

const DROP_COLORS = ['blue', 'cyan', 'pink', 'orange', 'purple', 'red', 'yellow'];

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
    this.world = new p2.World({gravity: [0, -50]});
    this.world.defaultContactMaterial.restitution = 0.3;

    this.currentJar = null;

    this.FIXED_TIME_STEP = 1 / 60; // seconds
    this.MAX_SUB_STEPS = 10; // Max sub steps to catch up with the wall clock

    this.dataManagement = new DataManagement();
    this.configLoadedSub = pubSub.subscribe('on-config-loaded', this.onConfigLoaded.bind(this));
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

    this.drops.forEach((d) => {
      d.update();
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

  addDrop() {
    const diameter = randomIntBetween(
      this.dataManagement.config.drops[0].diameter.min, 
      this.dataManagement.config.drops[0].diameter.max, 
      this.dataManagement.config.drops[0].diameter.distribution, 2);
    const dropPoint = this.dropArea?.randomPoint();
    const color = DROP_COLORS[randomIntBetween(0, DROP_COLORS.length - 1)];
    const drop = new Drop(dropPoint.x, dropPoint.y, diameter, diameter, DROP_TYPE.CIRCLE, this.world, {x: 0, y: 0, w: diameter, h: diameter, src: `./assets/button_${color}.png`}, { mass: 40/((50 - diameter) / 5.71 + 1) , stroke: 'black', strokeWidth: 1 });
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
    this.currentJar.editPoints.splice(index, 0, new EditPoint(point.x, point.y));
    this.currentJar.calculateParts(this.world)
  }

  updateJarCoordinates() {
    // save points location/update points
    this.canvas.onpointermove = this.canvas.onpointerup = this.canvas.onpointerout = this.canvas.onpointerleave = this.canvas.onpointercancel = null;
    this.currentJar.calculateParts(this.world);
  }

  onClickCanvas(clickEvent) {
      // check if click is on edit point
      let isJarBeingEdited = false;
      let pointBeingEdited;
      const eventPoint = this.screen.worldToScreen([clickEvent.offsetX, clickEvent.offsetY]);
      this.currentJar.editPoints.forEach((editPoint) => {
        if(isPointInCircle(new Point(...eventPoint), editPoint.shape)) {
          pointBeingEdited = editPoint;
          isJarBeingEdited = true;
        }
      });

      // if so, add event listeners
      if(isJarBeingEdited) {
        this.canvas.onpointermove = (event) => {
          pointBeingEdited.x += event.movementX;
          pointBeingEdited.y -= event.movementY;
          pointBeingEdited._shape.x += event.movementX;
          pointBeingEdited._shape.y -= event.movementY;
        }

        this.canvas.onpointerup = () => {
          this.updateJarCoordinates();
        }

        this.canvas.onpointerout = this.canvas.onpointerleave = this.canvas.onpointercancel = () => {
          // discard changes
          this.canvas.onpointermove = this.canvas.onpointerup = this.canvas.onpointerout = this.canvas.onpointerleave = this.canvas.onpointercancel = null;
        }

        return;
      }

      let rectBeingEditedIndex;
      for(let i = 0; i < this.currentJar.parts.length; i++) {
        const rect = this.currentJar.parts[i].shape;
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
      for(let i = 0; i < this.dropArea.editPoints.length; i++) {
        const editPoint = this.dropArea.editPoints[i];
        if(isPointInCircle(new Point(...eventPoint), editPoint.shape)) {
          isDropAreaBeingEdited = true;
          editPointIndex = i;
        }
      }

      if(isDropAreaBeingEdited) {
        this.addEditPointerEventListeners(this.dropArea.editPoints[editPointIndex]);

        const onEditMoveSub = pubSub.subscribe('edit-point-move', (updatedEditPoint) => {
          this.dropArea.updateEditPoint(editPointIndex, updatedEditPoint);
        }); 

        const onEditCancelSub = pubSub.subscribe('edit-point-cancel', (prevPoint) => {
          this.dropArea.updateEditPoint(editPointIndex, prevPoint);
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
    pubSub.subscribe('on-edit-jar', this.onEdit.bind(this));
    pubSub.subscribe('on-cancel-edit-jar', this.onCancel.bind(this));
    pubSub.subscribe('on-save-settings', this.onSaveSettings.bind(this));
    pubSub.subscribe('on-reset-jar', this.onReset.bind(this));
    pubSub.subscribe('on-drop', this.onDrop.bind(this));
    pubSub.subscribe('change-chroma-color', this.updateScreenBackground.bind(this));
  }

  onEdit() {
    this.canvas?.classList.add('edit');

    this.currentJar.edit();
    this.dropArea.edit();
    this.isEditing = true;
    this.draw();
  }

  onCancel() {
    this.canvas?.classList.remove('edit');
    
    this.isEditing = false;
    this.currentJar.endEdit();
    this.dropArea.endEdit();
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
      console.log(event)
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
