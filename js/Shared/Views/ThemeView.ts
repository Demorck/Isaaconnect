import { Observer } from "@/Shared/Views/Observer";


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
        if (bodyElement) {
            bodyElement.setAttribute('class', data.theme);
        }
    }
}