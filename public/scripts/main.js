// @ts-check
import { initSettings, updateColorSettings } from './settings.js';
import { initFooter } from './footer.js';
import { setViewMode } from './viewMode.js';
import Main from './classes/Main.js';

const urlSearchParamsAsText = window.location.search;
const urlSearchParams = new URLSearchParams(urlSearchParamsAsText);

const main = new Main();

initSettings();

initFooter();

updateColorSettings({
  chromaColor: urlSearchParams.get('chroma'),
  uiColor: urlSearchParams.get('ui'),
});

setViewMode(urlSearchParams.get('bare') === 'true' ? true : false);
