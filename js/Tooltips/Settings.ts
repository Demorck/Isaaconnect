import { Utils } from "../Helpers/Utils.js";
import { StorageManager } from "../Helpers/Data/StorageManager.js";

/**
 * @description Display the settings tooltip.
 * @param {string} html - The HTML content of the tooltip.
 * @returns {Promise<string>} The updated HTML content of the tooltip.
 */
export async function settingsLogic(html: string): Promise<string> {
    const easyHtml = await Utils.loadHTML('/include/tooltips/easy.html');
    const attempt = StorageManager.currentAttempt;
    if (attempt < 0) {
        html = Utils.replacePlaceholders(html, { attempt: '' });
    } else {
        html = Utils.replacePlaceholders(html, { attempt: easyHtml });
    }

    const temp = document.createElement('div');
    temp.innerHTML = html;

    return temp.innerHTML;
}

/**
 * @description Handles the logic for the theme select.
 * @param {HTMLElement} container - The container to apply the logic to.
 */
export function themeLogic(container: HTMLElement): void {
    const theme = StorageManager.theme;
    const select = container.querySelector('[name=background]') as HTMLSelectElement;

    if (!select) {
        console.error('Select element with name="background" not found in the container');
        return;
    }

    select.addEventListener('change', () => {
        changeBackground(select);
    });

    container.querySelectorAll('option').forEach(option => { option.selected = false; });
    const selectedOption = container.querySelector(`option[value="${theme}"]`) as HTMLOptionElement;
    if (selectedOption) {
        selectedOption.selected = true;
    }
}

/**
 * @description Handles the logic for the autocomplete button.
 * @param {HTMLElement} container - The container to apply the logic to.
 */
export function autocompleteLogic(container: HTMLElement): void {
    const autocomplete = StorageManager.autocomplete;
    const checkbox = container.querySelector<HTMLInputElement>('#autocomplete')!;

    if (autocomplete) {
        checkbox.checked = true;
        checkbox.parentElement?.classList.add('tgl-checked');
    }

    checkbox.addEventListener('click', () => {
        changeAutocompletion(checkbox);
    });
}

/**
 * @description Handles the logic for the difficulty button.
 * @param {HTMLElement} container - The container to apply the logic to.
 */
export function difficultyLogic(container: HTMLElement): void {
    // if (StorageManager.currentAttempt > 0) return;

    const difficulty = StorageManager.difficulty;
    const checkbox = container.querySelector('#difficulty') as HTMLInputElement;

    if (difficulty === 'easy') {
        checkbox.checked = true;
        checkbox.parentElement?.classList.add('tgl-checked');
    }

    checkbox.addEventListener('click', () => {
        changeDifficulty(checkbox);
    });
}

/**
 * @description Handles the logic for the link copy button.
 * @param {HTMLElement} container - The container to apply the logic to.
 */
export function linkCopyLogic(container: HTMLElement): void {
    const link = StorageManager.link;
    const checkbox = container.querySelector('#linkWhenCopy') as HTMLInputElement;

    if (link) {
        checkbox.checked = true;
        checkbox.parentElement?.classList.add('tgl-checked');
    }

    checkbox.addEventListener('click', () => {
        changeLink(checkbox);
    });
}

function changeBackground(element: HTMLSelectElement): void {
    const body = document.querySelector('body') as HTMLBodyElement;
    const regex = /(.*-theme)/g;
    if (body.className.match(regex)) {
        body.className = body.className.replace(regex, '');
    }

    let theme = element.value;
    StorageManager.theme = theme;
    console.log(theme);

    if (element.value === 'void-theme') {
        const selectElement = document.querySelector('[name=background]') as HTMLSelectElement;
        const optionValues = Array.from(selectElement.options).map(o => o.value);
        let randomValue: string;
        do {
            randomValue = optionValues[Math.floor(Math.random() * optionValues.length)];
        } while (randomValue === 'void-theme');
        theme = randomValue;
        element.value = 'void-theme';
    }

    body.classList.add(theme);
}

function changeAutocompletion(element: HTMLInputElement): void {
    const autocomplete = StorageManager.autocomplete;
    const checkbox = document.querySelector('#autocomplete') as HTMLInputElement;
    if (autocomplete) {
        StorageManager.autocomplete = false;
        checkbox.parentElement?.classList.remove('tgl-checked');
    } else {
        StorageManager.autocomplete = true;
        checkbox.parentElement?.classList.add('tgl-checked');
    }
}

function changeDifficulty(element: HTMLInputElement): void {
    const difficulty = StorageManager.difficulty;
    const checkbox = document.querySelector('#difficulty') as HTMLInputElement;
    const cards = document.querySelectorAll('.card-module') as NodeListOf<HTMLElement>;
    if (difficulty === 'easy') {
        StorageManager.difficulty = 'normal';
        checkbox.parentElement?.classList.remove('tgl-checked');
        cards.forEach(card => {
            card.classList.remove('easy');
        });
    } else {
        StorageManager.difficulty = 'easy';
        checkbox.parentElement?.classList.add('tgl-checked');
        cards.forEach(card => {
            card.classList.add('easy');
        });
    }
}

function changeLink(checkbox: HTMLInputElement): void {
    const link = StorageManager.link;
    if (link) {
        StorageManager.link = false;
        checkbox.parentElement?.classList.remove('tgl-checked');
    } else {
        StorageManager.link = true;
        checkbox.parentElement?.classList.add('tgl-checked');
    }
}