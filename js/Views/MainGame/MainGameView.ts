import { Observer } from "../Observer.js";
import { StorageManager } from "../../Helpers/Data/StorageManager.js";
import { Constants } from "../../Helpers/Constants.js";

export class MainGameView implements Observer {
    private container: HTMLElement;
    private itemsContainer: HTMLElement;
    private groupsContainer: HTMLElement;
    private healthContainer: HTMLElement;

    constructor(container: HTMLElement | string) {
        this.container = typeof container === 'string' ? document.querySelector<HTMLElement>(container)! : container;
        this.itemsContainer = this.container.querySelector<HTMLElement>('#cards-module')!;
        this.groupsContainer = this.container.querySelector<HTMLElement>('#cards-win')!;
        this.healthContainer = document.querySelector<HTMLElement>('.hearts')!;
    }

    public update(): void {
        
        this.renderHealth(StorageManager.health);
        this.applyBorderRadius();
    }

    
    /**
     * @description Display and updates hearts on the screen
     *
     * @private
     * @param {number} health - The health of the player
     */
    private renderHealth(health: number): void {
        this.healthContainer.innerHTML = '';
        
        for (let i = 0; i < health; i++)
            this.healthContainer.innerHTML += `<img src="/assets/gfx/heart.png" alt="heart" data-type="health">`;

        for (let i = health; i < Constants.MAX_HEALTH; i++)
            this.healthContainer.innerHTML += `<img src="/assets/gfx/empty heart.png" alt="empty heart" data-type="empty">`;
    }

    public toggleSubmitButton(disabled: boolean): void {
        const submitButton = document.querySelector<HTMLButtonElement>('[data-id="submit"]')!;
        console.log(submitButton);
        if (disabled)
            submitButton.classList.add('button--disabled');
        else
            submitButton.classList.remove('button--disabled');
        submitButton.disabled = disabled;
    }

    public applyBorderRadius() {

    }

    public clear(): void {
        this.itemsContainer.innerHTML = '';
    }

    public addItems(element: HTMLElement): void {
        this.itemsContainer.appendChild(element);
    }

    public getItemsContainer(): HTMLElement {
        return this.itemsContainer;
    }
}