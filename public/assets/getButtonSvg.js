export default function getButtonSvg(color) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg viewBox="0 0 512 512" width="512" height="512" style="stroke:black;stroke-width:15;" xmlns="http://www.w3.org/2000/svg" fill="${color}">
  <circle cx="50%" cy="50%" r="48%" />
  <circle fill="none" stroke="black" cx="50%" cy="50%" r="36%" />
  <circle cx="40%" cy="40%" r="30" stroke="none" fill="black" />
  <circle cx="60%" cy="60%" r="30" stroke="none" fill="black" />
  <circle cx="40%" cy="60%" r="30" stroke="none" fill="black" />
  <circle cx="60%" cy="40%" r="30" stroke="none" fill="black" />
</svg>`;
}
