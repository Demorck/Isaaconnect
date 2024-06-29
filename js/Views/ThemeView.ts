import { StorageManager } from "../Helpers/Data/StorageManager.js";

export class ThemeView {
    update() {
        let data = StorageManager.theme;
        const bodyElement = document.querySelector('body');
        if (bodyElement) {
            bodyElement.setAttribute('class', data);
        }
    }
}