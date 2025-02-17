// @ts-check
import { show, hide } from './utils/domUtils.js';
import { setPageColors } from './pageColors.js';
import pubSub from './classes/PubSub.js';

const colorSettings = {
    chromaColor: document.getElementById('chromaColor'), 
    uiColor: document.getElementById('uiColor'), 
};

const settingsDialog = document.getElementById('settings-dialog');
const dialogOverlay = document.getElementById('dialog-overlay');
dialogOverlay?.addEventListener('click', function closeSettignsDialog() {
    hide(dialogOverlay);
    hide(settingsDialog);
});

export function initSettings() {
    if(colorSettings.chromaColor) {
        colorSettings.chromaColor.onchange = () => {
            pubSub.publish('change-chroma-color', colorSettings.chromaColor?.['value']);
        };
    }

    if(colorSettings.uiColor) {
        colorSettings.uiColor.onchange = () => {
            pubSub.publish('change-ui-color', colorSettings.uiColor?.['value']);
        };
    }
}

export function showSettings() {
    show(dialogOverlay);
    show(settingsDialog);
}

const DEFAULT_COLORS = {
    chromaColor: '#00b140',
    uiColor: '#d4ce46',
};

/**
 * @param {object} colors
 */
export function updateColorSettings(colors) {
    const chromaColor = colors.chromaColor ?? DEFAULT_COLORS.chromaColor;
    const uiColor = colors.uiColor ?? DEFAULT_COLORS.uiColor;

    if(colorSettings.chromaColor) {
        colorSettings.chromaColor['value'] = chromaColor;
    }

    if(colorSettings.uiColor) {
        colorSettings.uiColor['value'] = uiColor;
    }
}


