// @ts-check
import { showSettings } from './settings.js';
import { getPageColors } from './pageColors.js';
import NOOP from './utils/NOOP.js';

const footer = {
    settings: document.getElementById('settings'),
    openWindow: document.getElementById('open-window'),
    edit: document.getElementById('edit'),
    save: document.getElementById('save'),
    cancel: document.getElementById('cancel')
}

const footerElement = document.getElementById('footer');

export function initFooter({ onEdit, onCancel } = { onEdit: NOOP, onCancel: NOOP }) {
    footer.settings?.addEventListener('click', showSettings);

    footer.openWindow?.addEventListener('click', function openInNewWindow() {
        // get colors
        const urlParams = new URLSearchParams();
        urlParams.append('bare', 'true');

        const url = new URL(`http://localhost:8080/jar/?${urlParams.toString()}`);

        const width = 550;
        const height = 150;
        window.open(
            url.toString(),
            'Jar of Things',
            `toolbar=0,location=0,locationbar=0,status=0,menubar=0,scrollbars=0,resizable=0,width=${width},height=${height}`);
    });

    const onEditEvent = () => {
        footer.save?.classList.remove('hidden');
        footer.cancel?.classList.remove('hidden');
        footer.edit?.classList.add('hidden');
        onEdit();
        if(footer.cancel) {
            footer.cancel.onclick = onCancelEvent;
        }
    };
    const onCancelEvent = () => {
        footer.save?.classList.add('hidden');
        footer.cancel?.classList.add('hidden');
        footer.edit?.classList.remove('hidden');
        onCancel();
        if(footer.edit) {
            footer.edit.onclick = onEditEvent;
        }
    };
    if(footer.edit) {
        footer.edit.onclick = onEditEvent;
    }

    document.addEventListener('mouseover', () => footerElement?.classList.remove('hidden'));
    document.addEventListener('mouseleave', () => footerElement?.classList.add('hidden'));
}



