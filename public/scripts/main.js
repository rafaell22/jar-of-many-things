// @ts-check
import { updateColorSettings } from './settings.js';
import { setViewMode } from './viewMode.js';
import Main from './classes/Main.js';

const urlSearchParamsAsText = window.location.search;
const urlSearchParams = new URLSearchParams(urlSearchParamsAsText);

const main = new Main();

setViewMode(urlSearchParams.get('bare') === 'true' ? true : false);
