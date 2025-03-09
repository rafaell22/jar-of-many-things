/**
 * @readonly
 * @enum {string}
 */
export const RANDOM_DISTRIBUTION = {
  UNIFORM: 'UNIFORM',
  NORMAL: 'NORMAL'
}

/**
 * @param {number} min - inclusive
 * @param {number} max - inclusive
 * @param {RANDOM_DISTRIBUTION} [distribution]
 * @param {number} [skew]
 * @returns {number}
 */
export function randomIntBetween(min, max, distribution, skew) {
  if(!distribution || distribution === RANDOM_DISTRIBUTION.UNIFORM) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  if(distribution === RANDOM_DISTRIBUTION.NORMAL) {
    const num = randn_bm(min, max, skew);
    return num;
  }
}

export const determinant = (v1, v2, v3) => {
	return v1.x * (v2.y * v3.z - v3.y * v2.z) - v2.x * (v1.y * v3.z - v3.y * v1.z) + v3.x * (v1.y * v2.z - v2.y * v1.z);
}

export const randn_bm = (min, max, skew) => {
  let u = 0, v = 0;
  while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random()
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
  
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) {
    num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
  } else {
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return num
}
