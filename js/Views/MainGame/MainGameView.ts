import { Observer } from "../Observer.js";
import { StorageManager } from "../../Helpers/Data/StorageManager.js";
import { Constants } from "../../Helpers/Constants.js";


/**
 * @description MainGameView class that displays the main game (the big container).
 *
 * @export
 * @class MainGameView
 * @type {MainGameView}
 * @implements {Observer}
 */
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

    public update(data: any): void {
        if (data.isMessage)
        {
            this.showMessage(data.message);
            return;
        }
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

    
    /**
     * @description Toggles the submit button
     *
     * @public
     * @param {boolean} disabled - True if the button should be disabled, false otherwise
     */
    public toggleSubmitButton(disabled: boolean): void {
        const submitButton = document.querySelector<HTMLButtonElement>('[data-id="submit"]')!;
        console.log(submitButton);
        if (disabled)
            submitButton.classList.add('button--disabled');
        else
            submitButton.classList.remove('button--disabled');
        submitButton.disabled = disabled;
    }

    
    /**
     * @description Apply border radius to the cards (top left, top right, bottom left, bottom right)
     *
     * @public
     */
    public applyBorderRadius() {
        let labels = document.querySelectorAll('.card-module');
        labels.forEach((label, index) => {
            label.classList.remove('rounded-tl-3xl', 'rounded-tr-3xl', 'rounded-bl-3xl', 'rounded-br-3xl');
            if (index === 0) label.classList.add('rounded-tl-3xl');
            if (index === 3) label.classList.add('rounded-tr-3xl');
            if (index === labels.length - 4) label.classList.add('rounded-bl-3xl');
            if (index === labels.length - 1) label.classList.add('rounded-br-3xl');
        });

        let solved = document.querySelectorAll('.solved-group');
        solved.forEach((group, index) => {
            group.classList.remove('rounded-tl-3xl', 'rounded-tr-3xl', 'rounded-bl-3xl', 'rounded-br-3xl');
            if (index === 0)
                group.classList.add('rounded-tl-3xl', 'rounded-tr-3xl');

            if (index === solved.length - 1)
                group.classList.add('rounded-bl-3xl', 'rounded-br-3xl');
        });
    }

    
    /**
     * @description Clear the items container
     *
     * @public
     */
    public clear(): void {
        this.itemsContainer.innerHTML = '';
    }

    
    /**
     * @description Add items to the items container
     *
     * @public
     * @param {HTMLElement} element - The element to add
     */
    public addItems(element: HTMLElement): void {
        this.itemsContainer.appendChild(element);
    }

    
    /**
     * @description Get items container
     *
     * @public
     * @returns {HTMLElement} The groups container
     */
    public getItemsContainer(): HTMLElement {
        return this.itemsContainer;
    }

    private showMessage(message: string, timeout: number = 3000): void {
        let container = document.querySelector<HTMLElement>('.message')!;
        container.innerHTML = message;
        container.classList.remove('hidden');
        setTimeout(() => {
            container.innerHTML = '';
            container.classList.add('hidden');
        }, timeout);
    }
}