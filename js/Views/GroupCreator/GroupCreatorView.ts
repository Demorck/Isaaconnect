import { Observer } from "../Observer.js";

export class GroupCreatorView implements Observer {
    private element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    update(data: any): void {
        if (data.difficulty != undefined) {
            this.updateDifficulty(data.difficulty);
        }
    }

    private updateDifficulty(newDifficulty: number): void {
        let imgDifficulty = this.element.querySelector('img')!;
        imgDifficulty.src = `/assets/gfx/Quality ${newDifficulty}.png`;
        imgDifficulty.alt = `Difficulté ${newDifficulty}`;
    }

    public select(): void {
        this.element.classList.add('selected');
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public toggleDisplay(display: boolean): void {
        if (display) {
            this.element.classList.remove('hidden');
        } else {
            this.element.classList.add('hidden');
        }
    }
}