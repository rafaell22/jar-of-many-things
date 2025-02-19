/**
 * @param {number} min - inclusive
 * @param {number} max -inclusive
 */
export function randomIntBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export const determinant = (v1, v2, v3) => {
	return v1.x * (v2.y * v3.z - v3.y * v2.z) - v2.x * (v1.y * v3.z - v3.y * v1.z) + v3.x * (v1.y * v2.z - v2.y * v1.z);
}
