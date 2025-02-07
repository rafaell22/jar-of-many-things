// @ts-check
import { showSettings } from './settings.js';
import NOOP from './utils/NOOP.js';
import { show, hide } from './utils/domUtils.js';

const footer = {
    settings: document.getElementById('settings'),
    openWindow: document.getElementById('open-window'),
    edit: document.getElementById('edit'),
    save: document.getElementById('save'),
    cancel: document.getElementById('cancel')
}

const footerElement = document.getElementById('footer');

export function initFooter({ onEdit, onCancel, onSave } = { onEdit: NOOP, onCancel: NOOP, onSave: NOOP }) {
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
        show(footer.save);
        show(footer.cancel);
        hide(footer.edit);
        onEdit();
        if(footer.cancel) {
            footer.cancel.onclick = onCancelEvent;
        }
        if(footer.save) {
            footer.save.onclick = onSaveEvent;
        }
    };
    const onCancelEvent = () => {
        hide(footer.save);
        hide(footer.cancel);
        show(footer.edit);
        onCancel();
        if(footer.edit) {
            footer.edit.onclick = onEditEvent;
        }
    };

    const onSaveEvent = () => {
        hide(footer.save);
        hide(footer.cancel);
        show(footer.edit);
        onSave();
        if(footer.edit) {
            footer.edit.onclick = onEditEvent;
        }
    }

    if(footer.edit) {
        footer.edit.onclick = onEditEvent;
    }

    document.addEventListener('mouseover', () => show(footerElement));
    document.addEventListener('mouseleave', () => hide(footerElement));
}



