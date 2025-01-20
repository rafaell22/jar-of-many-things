//@ts-check
'use strict'

let prevTimestamp = null;
let animationFrame;
let updateCb;

const start = function(cb) {
  console.log('starting...')
  prevTimestamp = null;
  updateCb = cb;

  update(0);
}

const pause = function() {
  cancelAnimationFrame(animationFrame);
  prevTimestamp = null;
}

const reset = function() {
  cancelAnimationFrame(animationFrame);
  prevTimestamp = null;
}

/**
* @param {number} timestamp - total time passed in milliseconds
*/
const update = (timestamp) => {
    let dt;
    if(!prevTimestamp) {
        dt = 0;
    } else {
        dt = timestamp - prevTimestamp;
    }

    prevTimestamp = timestamp;
    updateCb(dt);

    animationFrame = requestAnimationFrame(update);
};


export { pause, start };
