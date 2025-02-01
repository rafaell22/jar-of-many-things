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
import Image from './classes/Image.js';

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

const screen = new Screen(300, 600, '#00b140', ctx);
const world = new p2.World({gravity: [0, -50]});

const jar = new Jar([
  [100, 160], 
  [90, 140], 
  [90, 50], 
  [210, 50],
  [210, 140],
  [200, 160],
], world);
jar.parts.forEach((p) => world.addBody(p.body.body))

const draw = () => {
  screen.drawGrid();
  drops.forEach(d => {
    d.draw(screen);
  });
  images.forEach(i => {
    i.draw(screen);
  });
  jar.draw(screen);
}

const onEdit = () => {
  canvas?.classList.add('edit');
  pause();

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
const images = [];
// const floor = new Plane(0, 100, { isStatic: true, stroke: 'brown', strokeWidth: 1 });
// world.addBody(floor.body);
// shapes.push(floor);


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
  const diameter = randomIntBetween(10, 30);
  const drop = new Drop(randomIntBetween(110, 190), randomIntBetween(250, 300), diameter, diameter, DROP_TYPE.CIRCLE, world, { mass: 5, stroke: 'black', strokeWidth: 1 });
  drops.push(drop);
  setTimeout(addCircle, 1000);
}
// addCircle();

const jarBg = new Image(150, 50, 120, 120, '/jar/assets/jar.png', {});
jarBg.load(() => {
  images.push(jarBg);
});

// pause();
//




// Websockets logic
(async function() {
  console.log('connecting to ws server...')
  const ws = await connectToServer();

  ws.onmessage = (webSocketMessage) => {
    console.log('New message!');
    const messageBody = JSON.parse(webSocketMessage.data);

    if(messageBody.event === 'drop') {
      addCircle();
    }
  };
})()

function connectToServer() {
  const ws = new WebSocket('ws://localhost:8080/websockets');
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      console.log(ws.readyState)
      if(ws.readyState === 1) {
        console.log('ws connected!'); 
        clearInterval(timer)
        resolve(ws);
      }
    }, 100);
  });
}
