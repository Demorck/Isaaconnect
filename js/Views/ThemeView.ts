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
    update(data: any) {
        const bodyElement = document.querySelector('body');
        console.log(data);
        
        if (bodyElement) {
            bodyElement.setAttribute('class', data.theme);
        }
    }
}