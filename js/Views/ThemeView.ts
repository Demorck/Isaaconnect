export class ThemeView {
    update(data: string) {
        const bodyElement = document.querySelector('body');
        if (bodyElement) {
            bodyElement.setAttribute('class', data);
        }
    }
}