export const degToRad = (deg) => deg * Math.PI / 180;

export const radToDeg = (rad) => rad * 180 / Math.PI;

export const distanceBetweenPoints = (p1, p2) => Math.sqrt(Math.pow((p1[0] - p2[0]), 2) + Math.pow((p1[1] - p2[1]), 2));
