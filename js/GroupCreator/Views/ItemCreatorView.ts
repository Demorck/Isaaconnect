import { Observer } from "../../Shared/Views/Observer.js";

export class ItemCreatorView implements Observer {
    private element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    public update(): void {

    }

    public select(): void {
        this.element.classList.add('selected');
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public addEventListener(event: string, callback: EventListener): void {
        this.element.addEventListener(event, callback);
    }
}