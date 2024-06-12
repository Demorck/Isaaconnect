import { Utils } from "../Helpers/Utils.js";
import { StorageManager } from "../Helpers/StorageManager.js";

/**
 * @description Handles the logic for the difficulty button.
 * @param {string} container The container to apply the logic to.
 */
export function TTSLogic(container) {
    let tts = StorageManager.tts
    if (tts)
    {
        let checkbox = container.querySelector('#tts');
        checkbox.checked = true;
        checkbox.parentNode.classList.add('tgl-checked');
    }

    let checkbox = container.querySelector('#tts');
    checkbox.addEventListener('click', () => {
        changeTTS(checkbox);
    });
}


function changeTTS(element)
{
    let tts = StorageManager.tts;
    if (tts)
    {
        StorageManager.tts = false;
        element.parentNode.classList.remove('tgl-checked');
        document.querySelectorAll('.card-module').forEach(card => {
            card.removeEventListener('click', () => {});
        });
    }
    else
    {
        StorageManager.tts = true;
        element.parentNode.classList.add('tgl-checked');
        document.querySelectorAll('.card-module').forEach(card => {
            card.addEventListener('click', () => {
                let text = card.querySelector('.card-module--content').textContent;
                let utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-US';
                utterance.rate = 1;
                utterance.pitch = 1;
                speechSynthesis.speak(utterance);
            });
        });
    }
}
