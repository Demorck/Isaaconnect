import { StorageManager } from "../Shared/Helpers/Data/StorageManager.js";
import { Constants } from "../Shared/Helpers/Constants.js";

/**
 * @description Display the settings tooltip.
 * @param {string} html - The HTML content of the tooltip.
 * @returns {Promise<string>} The HTML content of the tooltip.
 */
export async function debugLogic(html: string): Promise<string> {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.innerHTML;
}

/**
 * @description Adds event listeners for debug actions.
 * @param {HTMLElement} container - The container to which the event listeners will be added.
 */
export function addEvent(container: HTMLElement): void {
    const resetButton = container.querySelector<HTMLElement>('#reset');
    const lifeButton = container.querySelector<HTMLElement>('#life');
    const tagsButton = container.querySelector<HTMLInputElement>('#tags');
    const range = container.querySelector<HTMLInputElement>('#range-group');
    const rangeItems = container.querySelector<HTMLInputElement>('#range-items');

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            location.reload();
        });
    }

    if (range) {
        range.addEventListener('input', () => {
            console.log(range.value);
            
            StorageManager.numberOfGroups = Number(range.value);
        });
    }

    if (rangeItems) {
        rangeItems.addEventListener('input', () => {
            console.log(rangeItems.value);
            
            StorageManager.numberOfItems = Number(rangeItems.value);
        });
    }

    if (tagsButton) {
        tagsButton.addEventListener('click', () => {
            StorageManager.bannedTags = tagsButton.checked;
        });
    }
}
