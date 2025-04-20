// @ts-check
import { showSettings } from './settings.js';
import { show, hide } from './utils/domUtils.js';
import pubSub from './classes/PubSub.js';

const toolbar = {
    settings: document.getElementById('settings'),
    edit: document.getElementById('edit'),
    cancel: document.getElementById('cancel'),
    reset: document.getElementById('reset'),
    drop: document.getElementById('drop'),
}

const toolbarElement = document.getElementById('toolbar');

export function initToolbar() {
    toolbar.settings?.addEventListener('click', showSettings);

    const onEditEvent = () => {
        show(toolbar.cancel);
        hide(toolbar.edit);
        pubSub.publish('on-edit-jar');
        if(toolbar.cancel) {
            toolbar.cancel.onclick = onCancelEvent;
        }
    };
    const onCancelEvent = () => {
        hide(toolbar.cancel);
        show(toolbar.edit);
        pubSub.publish('on-cancel-edit-jar');
        if(toolbar.edit) {
            toolbar.edit.onclick = onEditEvent;
        }
    };

    const onResetEvent = () => {
        pubSub.publish('on-reset-jar');
    }

    const onDropEvent = () => {
        pubSub.publish('on-drop');
    }

    if(toolbar.edit) {
        toolbar.edit.onclick = onEditEvent;
    }

    if(toolbar.reset) {
        toolbar.reset.onclick = onResetEvent;
    }

    if(toolbar.drop) {
        toolbar.drop.onclick = onDropEvent;
    }

    document.addEventListener('mouseover', () => show(toolbarElement));
    document.addEventListener('mouseleave', () => hide(toolbarElement));
}



