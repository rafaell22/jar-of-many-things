// @ts-check
import { initSettings, updateColorSettings } from './settings.js';
import { initFooter } from './footer.js'
import { initResizeEvent } from './resize.js';
import { setViewMode } from './viewMode.js';
import Main from './classes/Main.js';

const urlSearchParamsAsText = window.location.search;
const urlSearchParams = new URLSearchParams(urlSearchParamsAsText);

const main = new Main();


const chromaColorElement = document.getElementById('chroma');

initSettings({
  onChange: (colors) => main.updateScreenBackground.bind(main, colors.chromaColor)
});
initFooter({ onEdit: main.onEdit.bind(main), onCancel: main.onCancel.bind(main) });
initResizeEvent();

updateColorSettings({
    chromaColor: urlSearchParams.get('chroma'),
});

setViewMode(urlSearchParams.get('bare') === 'true' ? true : false);

