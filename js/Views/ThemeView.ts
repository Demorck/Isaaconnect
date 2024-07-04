import { StorageManager } from "../Helpers/Data/StorageManager.js";
import { Observer } from "./Observer.js";


/**
 * @description View for the theme
 *
 * @export
 * @class ThemeView
 * @type {ThemeView}
 * @implements {Observer}
 */
export class ThemeView implements Observer {
    update() {
        let data = StorageManager.theme;
        const bodyElement = document.querySelector('body');
        if (bodyElement) {
            bodyElement.setAttribute('class', data);
        }
    }
}