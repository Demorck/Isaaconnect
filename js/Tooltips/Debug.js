import { StorageManager } from "../Helpers/StorageManager.js";
import { Constants } from "../Helpers/Constants.js";


/**
 * @description Display the settings tooltip.
 * @returns {string} The HTML content of the tooltip.
 */
export async function debugLogic(html) {
    let temp = document.createElement('div');
    temp.innerHTML = html;

    return temp.innerHTML;
}


export function addEvent(container) {
    console.log(container);
    container.querySelector('#reset').addEventListener('click', () => {
        StorageManager.game = Constants.DEFAULT_DATA.game;
        location.reload();
    });

    container.querySelector('#life').addEventListener('click', () => {
        StorageManager.health = 20;
        location.reload();
    });
}