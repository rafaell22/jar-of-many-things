// @ts-check
import { show, hide } from './utils/domUtils.js';
import { setPageColors } from './pageColors.js';

const colorSettings = {
    chromaColor: document.getElementById('chromaColor'), 
};

const settingsDialog = document.getElementById('settings-dialog');
const dialogOverlay = document.getElementById('dialog-overlay');
dialogOverlay?.addEventListener('click', function closeSettignsDialog() {
    hide(dialogOverlay);
    hide(settingsDialog);
});

export function initSettings({
    onChange,
}) {
    if(colorSettings.chromaColor) {
        colorSettings.chromaColor.onchange = () => {
            onChange({ 
                chromaColor: colorSettings.chromaColor?.['value'],
            });
        };
    }
}

export function showSettings() {
    show(dialogOverlay);
    show(settingsDialog);
}

const DEFAULT_COLORS = {
    chromaColor: '#00b140',
};

/**
 * @param {object} colors
 */
export function updateColorSettings(colors) {
    const chromaColor = colors.chromaColor ?? DEFAULT_COLORS.chromaColor;

    if(colorSettings.chromaColor) {
        colorSettings.chromaColor['value'] = chromaColor;
    }
}


