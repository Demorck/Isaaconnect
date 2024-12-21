import { Loader } from "@/Loader";
import { Constants } from "@/Shared/Helpers/Constants";
import { StorageManager } from "@/Shared/Helpers/Data/StorageManager";

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();

    const rangeGroups = document.querySelector<HTMLInputElement>('#range-group');
    const rangeItems = document.querySelector<HTMLInputElement>('#range-items');
    const rangeBlind = document.querySelector<HTMLInputElement>('#range-blind');
    const rangeHealth = document.querySelector<HTMLInputElement>('#range-health');
    const rangeDifficulty = document.querySelector<HTMLInputElement>('#range-difficulty');
    const tagsButton = document.querySelector<HTMLInputElement>('#tags');
    const checkGrid = document.querySelector<HTMLInputElement>('#check-grid');
    const reset = document.querySelector<HTMLInputElement>('#reset');
    const play = document.querySelector<HTMLInputElement>('#play');

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

    if (checkGrid) {
        checkGrid.checked = StorageManager.checkGrid;
        if (checkGrid.checked) {
            checkGrid.parentElement?.classList.add('tgl-checked');
        }
        checkGrid.addEventListener('click', () => {
            StorageManager.checkGrid = checkGrid.checked;
            if (checkGrid.checked) {
                checkGrid.parentElement?.classList.add('tgl-checked');
            } else {
                checkGrid.parentElement?.classList.remove('tgl-checked');
            }
        });
    }

    if (rangeHealth) {
        rangeHealth.value = String(StorageManager.randomHealth);
        rangeHealth.addEventListener('input', () => {
            StorageManager.randomHealth = Number(rangeHealth.value);
        });
    }

    if (rangeDifficulty) {
        rangeDifficulty.value = String(StorageManager.customDifficulty);
        rangeDifficulty.addEventListener('input', () => {
            StorageManager.customDifficulty = Number(rangeDifficulty.value);
        });
    }

    if (play) {
        play.addEventListener('click', () => {
            window.location.href = `/random`;
        });
    }

    if (reset) {
        reset.addEventListener('click', () => {
            StorageManager.randomSettings = Constants.DEFAULT_DATA.randomSettings;
            window.location.reload();
        });
    }



    await Loader.loadComplete();
});

function modifyRangeBlind(rangeBlind: HTMLInputElement): void {
    rangeBlind.max = String(StorageManager.numberOfGroups * StorageManager.numberOfItems);
    StorageManager.numberOfBlindItems = Number(rangeBlind.value);

    let maxValueSpan = document.getElementById('range-blind-max-value')!;
    maxValueSpan.innerText = rangeBlind.max;

    let currentValueSpan = document.getElementById('range-blind-current-value')!;
    currentValueSpan.innerText = rangeBlind.value;

    let value = Number(rangeBlind.value);
    let max = Number(rangeBlind.max);
    if (value > max || value < 0) {        
        StorageManager.numberOfBlindItems = Number(rangeBlind.value);
        rangeBlind.value = rangeBlind.max;
    }
}

function encodeBase64(input: string): string {
    return window.btoa(input);
}

function decodeBase64(input: string): string {
    return window.atob(input);
}