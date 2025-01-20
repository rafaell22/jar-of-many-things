// @ts-check
import { showSettings } from './settings.js';
import { getPageColors } from './pageColors.js';
import NOOP from './utils/NOOP.js';

const footer = {
    settings: document.getElementById('settings'),
    openWindow: document.getElementById('open-window'),
    edit: document.getElementById('edit'),
}

export function initFooter({ onEdit, onEditEnd } = { onEdit: NOOP, onEditEnd: NOOP }) {
    footer.settings?.addEventListener('click', showSettings);

    footer.openWindow?.addEventListener('click', function openInNewWindow() {
        // get colors
        const pageColors = getPageColors();

        const urlParams = new URLSearchParams();
        urlParams.append('bare', 'true');

        urlParams.append('primary', pageColors.primary);
        urlParams.append('secondary', pageColors.secondary);
        urlParams.append('highlights', pageColors.highlights);
        urlParams.append('shadows', pageColors.shadows);
        urlParams.append('background', pageColors.background);

        const url = new URL(`http://localhost:8080/timer/?${urlParams.toString()}`);

        const width = 550;
        const height = 150;
        window.open(
            url.toString(),
            'Jar of Things',
            `toolbar=0,location=0,locationbar=0,status=0,menubar=0,scrollbars=0,resizable=0,width=${width},height=${height}`);
    });

    const onEditEvent = () => {
        onEdit();
        if(footer.edit) {
            footer.edit.onclick = onEditEndEvent;
        }
    };
    const onEditEndEvent = () => {
        onEditEnd();
        if(footer.edit) {
            footer.edit.onclick = onEditEvent;
        }
    };
    if(footer.edit) {
        footer.edit.onclick = onEditEvent;
    }
}



