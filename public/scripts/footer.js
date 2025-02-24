// @ts-check
import { showSettings } from './settings.js';
import { show, hide } from './utils/domUtils.js';
import pubSub from './classes/PubSub.js';

const footer = {
    settings: document.getElementById('settings'),
    edit: document.getElementById('edit'),
    cancel: document.getElementById('cancel'),
    reset: document.getElementById('reset'),
    drop: document.getElementById('drop'),
}

const footerElement = document.getElementById('footer');

export function initFooter() {
    footer.settings?.addEventListener('click', showSettings);

    const onEditEvent = () => {
        show(footer.cancel);
        hide(footer.edit);
        pubSub.publish('on-edit-jar');
        if(footer.cancel) {
            footer.cancel.onclick = onCancelEvent;
        }
    };
    const onCancelEvent = () => {
        hide(footer.cancel);
        show(footer.edit);
        pubSub.publish('on-cancel-edit-jar');
        if(footer.edit) {
            footer.edit.onclick = onEditEvent;
        }
    };

    const onResetEvent = () => {
        pubSub.publish('on-reset-jar');
    }

    const onDropEvent = () => {
        pubSub.publish('on-drop');
    }

    if(footer.edit) {
        footer.edit.onclick = onEditEvent;
    }

    if(footer.reset) {
        footer.reset.onclick = onResetEvent;
    }

    if(footer.drop) {
        footer.drop.onclick = onDropEvent;
    }

    document.addEventListener('mouseover', () => show(footerElement));
    document.addEventListener('mouseleave', () => hide(footerElement));
}



