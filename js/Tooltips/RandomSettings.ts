import { StorageManager } from "../Shared/Helpers/Data/StorageManager.js";
import { Constants } from "../Shared/Helpers/Constants.js";

/**
 * @description Adds event listeners for debug actions.
 * @param {HTMLElement} container - The container to which the event listeners will be added.
 */
export function addEvent(container: HTMLElement): void {
    const rangeGroups = container.querySelector<HTMLInputElement>('#range-group');
    const rangeItems = container.querySelector<HTMLInputElement>('#range-items');
    const rangeBlind = container.querySelector<HTMLInputElement>('#range-blind');
    const tagsButton = container.querySelector<HTMLInputElement>('#tags');
    const rangeHealth = container.querySelector<HTMLInputElement>('#range-health');

    if (rangeGroups) {
        rangeGroups.value = String(StorageManager.numberOfGroups);
        rangeGroups.addEventListener('input', () => {
            StorageManager.numberOfGroups = Number(rangeGroups.value);
            modifyRangeBlind(rangeBlind!);
        });
    }

    if (rangeItems) {
        rangeItems.value = String(StorageManager.numberOfItems);
        rangeItems.addEventListener('input', () => {
            StorageManager.numberOfItems = Number(rangeItems.value);
            modifyRangeBlind(rangeBlind!);
        });
    }

    if (rangeBlind) {
        rangeBlind.max = String(StorageManager.numberOfGroups * StorageManager.numberOfItems);
        rangeBlind.value = String(StorageManager.numberOfBlindItems);
        let maxValueSpan = document.getElementById('range-blind-max-value')!;
        maxValueSpan.innerText = rangeBlind.max;
        let currentValueSpan = document.getElementById('range-blind-current-value')!;
        currentValueSpan.innerText = rangeBlind.value;

        rangeBlind.addEventListener('input', () => {
            modifyRangeBlind(rangeBlind);
        });
    }

    if (tagsButton) {
        tagsButton.checked = StorageManager.bannedTags;
        if (tagsButton.checked) {
            tagsButton.parentElement?.classList.add('tgl-checked');
        }
        tagsButton.addEventListener('click', () => {
            StorageManager.bannedTags = tagsButton.checked;
            if (tagsButton.checked) {
                tagsButton.parentElement?.classList.add('tgl-checked');
            } else {
                tagsButton.parentElement?.classList.remove('tgl-checked');
            }
        });
    }

    if (rangeHealth) {
        rangeHealth.value = String(StorageManager.randomHealth);
        rangeHealth.addEventListener('input', () => {
            StorageManager.randomHealth = Number(rangeHealth.value);
        });
    }
}


function modifyRangeBlind(rangeBlind: HTMLInputElement): void {
    rangeBlind.max = String(StorageManager.numberOfGroups * StorageManager.numberOfItems);
    StorageManager.numberOfBlindItems = Number(rangeBlind.value);

    let maxValueSpan = document.getElementById('range-blind-max-value')!;
    maxValueSpan.innerText = rangeBlind.max;

    let currentValueSpan = document.getElementById('range-blind-current-value')!;
    currentValueSpan.innerText = rangeBlind.value;

    if (rangeBlind.value > rangeBlind.max) {
        StorageManager.numberOfBlindItems = Number(rangeBlind.value);
        rangeBlind.value = rangeBlind.max;
    }
}