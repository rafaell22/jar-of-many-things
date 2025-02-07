// @ts-check
/**
 * @param {Element|HTMLElement|string|null|undefined} el
 */
export function hide(el) {
    if(!el) { return }
    if(typeof el === 'string') { el = document.querySelector(el); }
    el?.classList.add('hidden');
}

/**
 * @param {Element|HTMLElement|string|null|undefined} el
 */
export function show(el) {
    if(!el) { return }
    if(typeof el === 'string') { el = document.querySelector(el); }
    el?.classList.remove('hidden');
}
