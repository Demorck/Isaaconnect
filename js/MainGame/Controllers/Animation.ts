
/**
 * Create the animation by swapping the selected cards
 *
 * @deprecated
 * @export
 */
export function animation() {
    let selected = document.querySelectorAll<HTMLElement>('.card-module--selected');
    let first = selected[0];
    let last = selected[selected.length - 1];

    swapUI(first, last);
}


/**
 * Swap the position of two elements in the DOM
 *
 * @export
 * @param {HTMLElement} node1 The first element
 * @param {HTMLElement} node2 The second element
 */
export function swap(node1: HTMLElement, node2: HTMLElement): void {
    let cards = document.querySelectorAll<HTMLElement>('.card-module');
    let afterNode2 = node2.nextElementSibling;
    let parent = node2.parentNode;
    node1.replaceWith(node2);
    parent?.insertBefore(node1, afterNode2);
}


/**
 * Create the animation by swapping the selected cards in the UI and in the DOM
 *
 * @export
 * @param {HTMLElement} node1 The first element
 * @param {HTMLElement} node2 The second element
 */
export function swapUI(node1: HTMLElement, node2: HTMLElement): void {
    let finalElement1Style = {
        x: 0,
        y: 0,
    };
    let finalElement2Style = {
        x: 0,
        y: 0,
    };

    let element1 = {
        x: node1.getBoundingClientRect().left,
        y: node1.getBoundingClientRect().top,
    };
    let element2 = {
        x: node2.getBoundingClientRect().left,
        y: node2.getBoundingClientRect().top,
    };
       
    node1.classList.add('transition');
    node2.classList.add('transition');

    finalElement1Style.x = element2.x - element1.x;
    finalElement2Style.x = element1.x - element2.x;
    finalElement1Style.y = element2.y - element1.y;
    finalElement2Style.y = element1.y - element2.y;

    node1.style.transform = `translate(${finalElement1Style.x}px, ${finalElement1Style.y}px)`;
    node2.style.transform = `translate(${finalElement2Style.x}px, ${finalElement2Style.y}px)`;

    setTimeout(() => {
        try {
            swap(node1, node2);
        } catch (ignored) {}
        node1.classList.remove('transition');
        node2.classList.remove('transition');
        node2.removeAttribute('style');
        node1.removeAttribute('style');
    }, 500);
};