import { StorageManager } from "../Helpers/Data/StorageManager.js";
import { Constants } from "../Helpers/Constants.js";

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
    const testsButton = container.querySelector<HTMLElement>('#tests');

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            StorageManager.game = Constants.DEFAULT_DATA.game;
            location.reload();
        });
    }

    if (lifeButton) {
        lifeButton.addEventListener('click', () => {
            StorageManager.health = 20;
            location.reload();
        });
    }

    if (testsButton) {
        testsButton.addEventListener('click', async () => {
            // Code for tests button click event
        });
    }
}
