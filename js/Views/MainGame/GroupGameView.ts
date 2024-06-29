import { Observer } from "../Observer.js";

export class GroupGameView implements Observer {
    private container: HTMLElement;
    
    constructor(container: HTMLElement | string) {
        this.container = typeof container === 'string' ? document.querySelector<HTMLElement>(container)! : container;
    }

    public update(): void {
        this.container.innerHTML = '';
    }  

}