// @ts-check
import { show, hide } from './utils/domUtils.js';
import pubSub from './classes/PubSub.js';

const colorSettings = {
    chromaColor: document.getElementById('chromaColor'), 
    uiColor: document.getElementById('uiColor'), 
};

const config = {
    minDiameter: document.getElementById('drops-diameter-min'),
    maxDiameter: document.getElementById('drops-diameter-max'),
    diameterDistribution: document.getElementById('drops-diameter-distribution'),
}

const actions = {
    save: document.getElementById('save'),
}

const settingsDialog = document.getElementById('settings-dialog');
const dialogOverlay = document.getElementById('dialog-overlay');
dialogOverlay?.addEventListener('click', function closeSettignsDialog() {
    hide(dialogOverlay);
    hide(settingsDialog);
});

export function initSettings(configData) {
    if(colorSettings.chromaColor) {
        colorSettings.chromaColor.value = configData.chromaColor;
        colorSettings.chromaColor.onchange = () => {
            pubSub.publish('change-chroma-color', colorSettings.chromaColor?.['value']);
        };
    }

    if(colorSettings.uiColor) {
        colorSettings.uiColor.value = configData.uiColor;
        colorSettings.uiColor.onchange = () => {
            pubSub.publish('change-ui-color', colorSettings.uiColor?.['value']);
        };
    }

    if(actions.save) {
        actions.save.onclick = () => {
            pubSub.publish('on-save-settings');
        }
    }

    if(config.minDiameter) {
        config.minDiameter.value = configData.drops[0].diameter.min;
        config.minDiameter.onchange = () => {
            pubSub.publish('on-change-min-diameter', {
                minDiameter: parseInt(event?.target.value)
            });
        }
    }

    if(config.maxDiameter) {
        config.maxDiameter.value = configData.drops[0].diameter.max;
        config.maxDiameter.onchange = (event) => {
            pubSub.publish('on-change-max-diameter', {
                maxDiameter: parseInt(event?.target.value),
            });
        }
    }

    if(config.diameterDistribution) {
        config.diameterDistribution.value = configData.drops[0].diameter.distribution;
        config.diameterDistribution.onchange = (event) => {
            pubSub.publish('on-change-diameter-distribution', {
                diameterDistribution: event.target.value,
            });
        }
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


