// @ts-check
import { initSettings, updateColorSettings } from './settings.js';
import { initFooter } from './footer.js'
import { initResizeEvent } from './resize.js';
import { setViewMode } from './viewMode.js';
import { start, pause } from './mainloop.js';
import Screen from './classes/Screen.js';
import Drop, {DROP_TYPE} from './classes/Drop.js';
import Jar from './classes/Jar.js';
import { randomIntBetween } from './utils/math.js';
import Ws from './classes/Ws.js';
import {distanceBetweenPoints} from './utils/geometry.js';

const p2 = /** @type {object} */ (globalThis).p2;

const urlSearchParamsAsText = window.location.search;
const urlSearchParams = new URLSearchParams(urlSearchParamsAsText);

const canvas = /** @type {HTMLCanvasElement|null} */ (document.getElementById('world'));
let ctx;
if(canvas) {
  ctx = canvas.getContext('2d');
} else {
  throw new Error('Canvas not found!');
}

////////////////////////
// EVENT LISTENERS TO UPDATE JAR
////////////////////////
canvas.onpointerdown = (event) => {
  // check if click is on edit point
  let pointBeingEdited;
  const eventPoint = screen.worldToScreen([event.offsetX, event.offsetY]);
  jar.editPoints.forEach((editPoint) => {
    console.log(distanceBetweenPoints(eventPoint, [editPoint._shape.x, editPoint._shape.y]));
    console.log(distanceBetweenPoints(eventPoint, [editPoint._shape.x, editPoint._shape.y]) <= editPoint._shape.radius);
    if(distanceBetweenPoints(eventPoint, [editPoint._shape.x, editPoint._shape.y]) <= editPoint._shape.radius) {
      pointBeingEdited = editPoint;
    }
  });

  // if so, add event listeners
  if(pointBeingEdited) {
    console.log('pointBeingEdited: ', pointBeingEdited);
    canvas.onpointermove = (event) => {
      console.log(event)
      pointBeingEdited._shape.x += event.movementX;
      pointBeingEdited._shape.y -= event.movementY;
    }

    canvas.onpointerup = () => {
      // save points location/update points
      canvas.onpointermove = canvas.onpointerup = canvas.onpointerout = canvas.onpointerleave = canvas.onpointercancel = null;
    }

    canvas.onpointerout = canvas.onpointerleave = canvas.onpointercancel = () => {
      // discard changes
      canvas.onpointermove = canvas.onpointerup = canvas.onpointerout = canvas.onpointerleave = canvas.onpointercancel = null;
    }
  }
}
////////////////////////
// END EVENT LISTENERS TO UPDATE JAR
////////////////////////

const screen = new Screen(300, 600, '#00b140', ctx);
const world = new p2.World({gravity: [0, -50]});

const jar = new Jar([
  [100, 160], 
  [90, 140], 
  [90, 50], 
  [210, 50],
  [210, 140],
  [200, 160],
], world, {
  x: 150, 
  y: 50, 
  w: 120, 
  h: 120, 
  src: '/jar/assets/jar.png',
});

const draw = () => {
  screen.drawGrid();
  drops.forEach(d => {
    d.draw(screen);
  });
  jar.draw(screen);
}

const onEdit = () => {
  canvas?.classList.add('edit');
  // pause();

  jar.edit();
  draw();
}
const onEditEnd = () => {
  canvas?.classList.remove('edit');
  
  jar.endEdit();
}

initSettings();
initFooter({ onEdit, onEditEnd });
initResizeEvent();

updateColorSettings({
    primary: urlSearchParams.get('primary'),
    secondary: urlSearchParams.get('secondary'),
    highlights: urlSearchParams.get('highlights'),
    shadows: urlSearchParams.get('shadows'),
    background: urlSearchParams.get('background'),
});

setViewMode(urlSearchParams.get('bare') === 'true' ? true : false);

////////////////

const drops = [];

const fixedTimeStep = 1 / 60; // seconds
const maxSubSteps = 10; // Max sub steps to catch up with the wall clock

// Animation loop
start(
  /**
   * @param {number} dt - time in milliseconds since last execution
   */
  (dt) => {
    // Move bodies forward in time
    world.step(fixedTimeStep, dt / 1000, maxSubSteps);

    drops.forEach((d) => {
      d.update();
    });
    screen.clear();
    draw();
});

const addCircle = () => {
  console.log('Add circle!');
  const diameter = randomIntBetween(10, 30);
  const drop = new Drop(randomIntBetween(110, 190), randomIntBetween(250, 300), diameter, diameter, DROP_TYPE.CIRCLE, world, {x: 0, y: 0, w: diameter, h: diameter, src: '/jar/assets/button_orange.png' }, { mass: 5, stroke: 'black', strokeWidth: 1 });
  drops.push(drop);
  // setTimeout(addCircle, 1000);
}
// addCircle();

const ws = new Ws();
ws.connect({
  drop: {
    event: 'drop',
    cb: addCircle,
  }
});


