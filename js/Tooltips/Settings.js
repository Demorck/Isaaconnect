import { Utils } from "../Helpers/Utils.js";
import { StorageManager } from "../Helpers/StorageManager.js";

/**
 * @description Display the settings tooltip.
 * @returns {string} The HTML content of the tooltip.
 */
export async function settingsLogic(html) {
    let easyHtml = await Utils.loadHtml('/include/tooltips/easy.html');
    let attempt = StorageManager.currentAttempt;
    if (attempt > 0)
    {
        html = Utils.replacePlaceholders(html, { attempt: '' });
    }
    else {
        html = Utils.replacePlaceholders(html, { attempt: easyHtml });
    }

    let temp = document.createElement('div');
    temp.innerHTML = html;

    return temp.innerHTML;
}

/**
 * @description Handles the logic for the theme select.
 * @param {string} container The container to apply the logic to.
 */
export function themeLogic(container) {

    let theme = StorageManager.theme
    let select = container.querySelector('[name=background]');

    if (!select) {
        console.error('Select element with name="background" not found in the container');
        return;
    }

    select.addEventListener('change', () => {
        changeBackground(select);
    });
    
    container.querySelectorAll('option').forEach(option => { option.selected = false; });
    container.querySelector('option[value="' + theme + '"]').selected = true;
}

/**
 * @description Handles the logic for the autocomplete button.
 * @param {string} container The container to apply the logic to.
 */
export function autocompleteLogic(container) {
    let autocomplete = StorageManager.autocomplete
    if (autocomplete)
    {
        let checkbox = container.querySelector('#autocomplete');
        checkbox.checked = true;
        checkbox.parentNode.classList.add('tgl-checked');
    }

    let checkbox = container.querySelector('#autocomplete');
    checkbox.addEventListener('click', () => {
        changeAutocompletion(checkbox);
    });
}

/**
 * @description Handles the logic for the difficulty button.
 * @param {string} container The container to apply the logic to.
 */
export function difficultyLogic(container) {
    if(StorageManager.currentAttempt > 0)
        return;

    let difficulty = StorageManager.difficulty
    if (difficulty == 'easy')
    {
        let checkbox = container.querySelector('#difficulty');
        checkbox.checked = true;
        checkbox.parentNode.classList.add('tgl-checked');
    }

    let checkbox = container.querySelector('#difficulty');
    checkbox.addEventListener('click', () => {
        changeDifficulty(checkbox);
    });
}


function changeBackground(element)
{
    let body = document.querySelector('body');
    const regex = new RegExp('(.*-theme)', 'g');
    if (body.className.match(regex))
    {
        body.className = body.className.replace(regex, '');
    }

    let theme = element.value;

    if (element.value === 'void-theme')
    {
        let selectElement = document.querySelector('[name=background]');
        let optionValues = [...selectElement.options].map(o => o.value)
        let randomValue = optionValues[Math.floor(Math.random() * optionValues.length)];
        theme = randomValue;
        element.selected = false;
        let randomElement = document.querySelector(`option[value="${randomValue}"]`);
        randomElement.checked = true;
    }

    StorageManager.theme = theme;
    body.classList.add(theme);
}

function changeAutocompletion(element)
{
    let autocomplete = StorageManager.autocomplete
    let checkbox = document.querySelector('#autocomplete');
    if (autocomplete)
    {
        StorageManager.autocomplete = false;
        checkbox.parentNode.classList.remove('tgl-checked');
    }
    else
    {
        StorageManager.autocomplete = true;
        checkbox.parentNode.classList.add('tgl-checked');
    }
}

function changeDifficulty(element)
{
    let difficulty = StorageManager.difficulty
    let checkbox = document.querySelector('#difficulty');
    let cards = document.querySelectorAll('.card-module--content');
    if (difficulty === 'easy')
    {
        StorageManager.difficulty = 'normal';
        checkbox.parentNode.classList.remove('tgl-checked');

        cards.forEach(card => {
            card.classList.add('hidden');
        });
    }
    else
    {
        StorageManager.difficulty = 'easy';
        checkbox.parentNode.classList.add('tgl-checked');
        cards.forEach(card => {
            card.classList.remove('hidden');
        });
    }
}