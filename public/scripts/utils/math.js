/**
 * @param {number} min - inclusive
 * @param {number} max -inclusive
 */
export function randomIntBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
