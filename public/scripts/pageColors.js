// @ts-check

/**
 * @param {object} colors
 * @param {string|null} colors.primary
 * @param {string|null} colors.secondary
 * @param {string|null} colors.highlights
 * @param {string|null} colors.shadows
 * @param {string|null} colors.background
 */
export function setPageColors(colors) {
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    document.documentElement.style.setProperty('--highlights-color', colors.highlights);
    document.documentElement.style.setProperty('--shadows-color', colors.shadows);
    document.documentElement.style.setProperty('--background-color', colors.background);
}

export function getPageColors() {
    return {
        primary: document.documentElement.style.getPropertyValue('--primary-color'),
        secondary: document.documentElement.style.getPropertyValue('--secondary-color'),
        highlights: document.documentElement.style.getPropertyValue('--highlights-color'),
        shadows: document.documentElement.style.getPropertyValue('--shadows-color'),
        background: document.documentElement.style.getPropertyValue('--background-color'),
    };
}
