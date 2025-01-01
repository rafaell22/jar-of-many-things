// @ts-check
import { initSettings, updateColorSettings } from './settings.js';
import { initFooter } from './footer.js'
import { initResizeEvent } from './resize.js';
import { setViewMode } from './viewMode.js';
import { start } from './mainloop.js';
import Screen from './Screen.js';
import Circle from './Circle.js';
import Rect from './Rect.js';
import Drop from './Drop.js';
// import Plane from './Plane.js';

const urlSearchParamsAsText = window.location.search;
const urlSearchParams = new URLSearchParams(urlSearchParamsAsText);

initSettings();
initFooter();
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
const ctx = document.getElementById("world")?.getContext("2d");

const screen = new Screen(300, 600, '#00b140', ctx);
const world = new p2.World({gravity: [0, -50]});

const drops = [];
// const floor = new Plane(0, 100, { isStatic: true, stroke: 'brown', strokeWidth: 1 });
// world.addBody(floor.body);
// shapes.push(floor);

/*
const leftWall = new Rect(60, 90, 20, 100, { isStatic: true, stroke: 'blue', strokeWidth: 1, angle: -30 });
shapes.push(leftWall);
world.addBody(leftWall.body);
*/

/*
const topLeftWall = new Rect(60, 150, 20, 100, { isStatic: true, stroke: 'blue', strokeWidth: 1, angle: 15 });
shapes.push(topLeftWall);
world.addBody(topLeftWall.body);
*/
 
/*
const rightWall = new Rect(220, 90, 20, 100, { isStatic: true, stroke: 'blue', strokeWidth: 1, angle: 30 });
shapes.push(rightWall);
world.addBody(rightWall.body);
*/

/*
const bottomWall = new Rect(100, 80, 100, 20, { isStatic: true, stroke: 'blue', strokeWidth: 1 });
shapes.push(bottomWall)
world.addBody(bottomWall.body);
*/

const fixedTimeStep = 1 / 60; // seconds
const maxSubSteps = 10; // Max sub steps to catch up with the wall clock

// Animation loop
start((dt) => {
  console.log(dt)
    // Move bodies forward in time
    world.step(fixedTimeStep, dt / 1000, maxSubSteps);

    drops.forEach((d) => {
      d.update();
    });
    screen.clear();
    // draw();
});

const addCircle = () => {
  const diameter = randomIntBetween(10, 30);
  const drop = new Drop(randomIntBetween(110, 190), randomIntBetween(250, 300), diameter, diameter, { mass: 2 + Math.pow((diameter - 5) / 5, 3), stroke: 'black', strokeWidth: 1 });
  drops.push(drop);
  world.addBody(drop.body);
  setTimeout(addCircle, 1000);
}
addCircle();

function draw() {
  drops.forEach(d => {
    d.draw(screen);
  });
}

function randomIntBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
