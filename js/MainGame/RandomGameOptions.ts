import { Loader } from "../Loader";
import { StorageManager } from "../Shared/Helpers/Data/StorageManager";

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();

    const rangeGroups = document.querySelector<HTMLInputElement>('#range-group');
    const rangeItems = document.querySelector<HTMLInputElement>('#range-items');
    const rangeBlind = document.querySelector<HTMLInputElement>('#range-blind');
    const tagsButton = document.querySelector<HTMLInputElement>('#tags');
    const rangeHealth = document.querySelector<HTMLInputElement>('#range-health');
    const rangeDifficulty = document.querySelector<HTMLInputElement>('#range-difficulty');
    const test = document.querySelector<HTMLInputElement>('#test');
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

    if (test) {
        test.addEventListener('click', () => {
            let json = JSON.stringify(StorageManager.randomSettings);
            let options = encodeBase64(json);
            let a = document.querySelector<HTMLInputElement>('#permalink')!;
            a.value = options;
        });
    }

    if (play) {
        play.addEventListener('click', () => {
            let json = JSON.stringify(StorageManager.randomSettings);
            let options = encodeBase64(json);
            window.location.href = `/random?options=${options}`;
        });
    }

});

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

function encodeBase64(input: string): string {
    return window.btoa(input);
}

function decodeBase64(input: string): string {
    return window.atob(input);
}