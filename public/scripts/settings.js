// @ts-check
import { show, hide } from './utils/domUtils.js';
import { setPageColors } from './pageColors.js';

const colorSettings = {
    primary: document.getElementById('primaryColor'),
    secondary: document.getElementById('secondaryColor'),
    highlights: document.getElementById('highlightsColor'),
    shadows: document.getElementById('shadowsColor'),
    background: document.getElementById('backgroundColor'),
};

const settingsDialog = document.getElementById('settings-dialog');
const dialogOverlay = document.getElementById('dialog-overlay');
dialogOverlay?.addEventListener('click', function closeSettignsDialog() {
    hide(dialogOverlay);
    hide(settingsDialog);
});

export function initSettings() {
    colorSettings.primary?.addEventListener('change', function changePrimaryColor() {
        setPageColors({
            primary: colorSettings.primary?.['value'],
            secondary: colorSettings.secondary?.['value'],
            highlights: colorSettings.highlights?.['value'],
            shadows: colorSettings.shadows?.['value'],
            background: colorSettings.background?.['value'],
        });
    });

    colorSettings.primary?.addEventListener('change', changeColor);
    colorSettings.secondary?.addEventListener('change', changeColor);
    colorSettings.highlights?.addEventListener('change', changeColor);
    colorSettings.shadows?.addEventListener('change', changeColor);
    colorSettings.background?.addEventListener('change', changeColor);
}

export function showSettings() {
    show(dialogOverlay);
    show(settingsDialog);
}

const DEFAULT_COLORS = {
    primary: '#0d9263',
    secondary: '#d4ce46',
    highlights: '#4aba91',
    shadows: '#0e5135',
    background: '#494b4b',
};

/**
 * @param {object} colors
 * @param {string|null} colors.primary
 * @param {string|null} colors.secondary
 * @param {string|null} colors.highlights
 * @param {string|null} colors.shadows
 * @param {string|null} colors.background
 */
export function updateColorSettings(colors) {
    const primaryColor = colors.primary ?? DEFAULT_COLORS.primary;
    const secondaryColor = colors.secondary ?? DEFAULT_COLORS.secondary;
    const highlightsColor = colors.highlights ?? DEFAULT_COLORS.highlights;
    const shadowsColor = colors.shadows ?? DEFAULT_COLORS.shadows;
    const backgroundColor = colors.background ?? DEFAULT_COLORS.background;

    if(colorSettings.primary) {
        colorSettings.primary['value'] = primaryColor;
    }
    if(colorSettings.secondary) {
        colorSettings.secondary['value'] = secondaryColor;
    }
    if(colorSettings.highlights) {
        colorSettings.highlights['value'] = highlightsColor;
    }
    if(colorSettings.shadows) {
        colorSettings.shadows['value'] = shadowsColor;
    }
    if(colorSettings.background) {
        colorSettings.background['value'] = backgroundColor;
    }

    setPageColors({
        primary: primaryColor,
        secondary: secondaryColor,
        highlights: highlightsColor,
        shadows: shadowsColor,
        background: backgroundColor,
    });
}

function changeColor() {
    updateColorSettings({
        primary: colorSettings.primary?.['value'],
        secondary: colorSettings.secondary?.['value'],
        highlights: colorSettings.highlights?.['value'],
        shadows: colorSettings.shadows?.['value'],
        background: colorSettings.background?.['value'],
    });
}


