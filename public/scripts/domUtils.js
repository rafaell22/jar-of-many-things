// @ts-check
/**
 * @param {Element|HTMLElement|null|undefined} el
 */
export function hide(el) {
    if(!el) { return }
    el.classList.add('hidden');
}

/**
 * @param {Element|HTMLElement|null|undefined} el
 */
export function show(el) {
    if(!el) { return }
    el.classList.remove('hidden');
}
