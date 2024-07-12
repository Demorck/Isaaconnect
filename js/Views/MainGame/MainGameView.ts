import { Observer } from "../Observer.js";
import { StorageManager } from "../../Helpers/Data/StorageManager.js";
import { Constants } from "../../Helpers/Constants.js";
import { Utils } from "../../Helpers/Utils.js";
import { animation, swap, swapUI } from "../../Controllers/MainGame/Animation.js";
import { MainGameController } from "../../Controllers/MainGame/MainGameController.js";
import { GroupGame } from "../../Models/MainGame/GroupGame.js";

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
    private controller: MainGameController;
    private itemsContainer: HTMLElement;
    private groupsContainer: HTMLElement;
    private healthContainer: HTMLElement;

    constructor(container: HTMLElement | string) {
        this.container = typeof container === 'string' ? document.querySelector<HTMLElement>(container)! : container;
        this.itemsContainer = this.container.querySelector<HTMLElement>('#cards-module')!;
        this.groupsContainer = this.container.querySelector<HTMLElement>('#cards-win')!;
        this.healthContainer = document.querySelector<HTMLElement>('.hearts')!;
        this.controller = null as any;
    }

    public update(data: any): void {
        if (data.isMessage)
        {
            this.showMessage(data.message);
            return;
        }

        if (data.animate)
        {
            let group: GroupGame = data.group;
            let itemsID: number[] = group.getSelectedItems().map(item => item.getId());
            let selected = document.querySelectorAll<HTMLElement>('.card-module--selected');
            if (selected.length != Constants.NUMBER_OF_ITEMS)
            {
                itemsID.forEach((id, index) => {
                    let item = document.querySelector<HTMLElement>(`[data-id="${id}"]`);
                    item?.classList.add('card-module--selected');
                });
            }

            this.animate().then(async () => {
                await this.controller.toggleGroupSolved(data.group);
                if (data.deselect) this.deselectCards();
            });
        }
        
        if (data.isFinished && data.autocomplete || data.isFinished && data.win) {
            Utils.sleep(1000).then(() => {
                data.streak = StorageManager.winStreak;
                data.losses = StorageManager.losses;                
                this.controller?.toggleFinishedState();
                this.toggleFinishedState(data);
            });
        }

        this.renderHealth(StorageManager.health);
        this.applyBorderRadius();
    }

    private toggleFinishedState(data: any): void {
        this.showResults(data.win, data).then(html => {
            let modalContainer = document.querySelector<HTMLElement>('#modal-wrapper')!; 
            modalContainer.innerHTML = html;
            modalContainer.classList.remove('hidden');
            // TODO: A mettre dans le controller
            document.querySelector('.close-button')!.addEventListener('click', () => {
                modalContainer.classList.add('hidden');
            });
            document.querySelector('[data-id="results-wrapper"]')!.innerHTML = this.convertAttemptToSquareMatrix();
            let copyButton = document.getElementById('copy')!;
            copyButton.addEventListener('click', () => this.copyResults(copyButton, data));
    
        });
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

    private deselectCards(): void {
        let selectedCards = document.querySelectorAll('.card-module');
        selectedCards.forEach(card => {
            card.classList.remove('card-module--selected', 'card-module--disabled');
            card.querySelector<HTMLInputElement>('input[type="checkbox"]')!.disabled = false;
        });

        let submitButton = document.querySelector<HTMLInputElement>('button[data-id="submit"]');
        if (submitButton != null) {
            submitButton.classList.add('button--disabled');
            submitButton.disabled = true;
        }
    }

    private async showResults(win: boolean, data: any): Promise<string> {
        let modalPath: string;
        if (win) modalPath = "/include/modals/win.html";
        else modalPath = "/include/modals/lose.html";
        let html = await Utils.loadHTML(modalPath);
        
        html = Utils.replacePlaceholders(html, data);
        return html;
    }

    private convertAttemptToSquareMatrix(): string {
        let attempt = StorageManager.attempts;
        let content = `<div data-id="results" class="flex flex-col">`;
        attempt.forEach((group, index_attempt) => {
            content += `<div data-id="results-attempt${index_attempt}" class="flex justify-center items-center">`;
            group.forEach((currentGroup, index_group) => {
                let index = currentGroup.index;
                let rounded = index_group % 4 == 0 ? "rounded-l-lg" : index_group % 4 == 3 ? "rounded-r-lg" : "";
                content += `<span data-id="results-attempt${index_attempt}-item${index_group}-group${index}" class="bg-${Constants.COLORS[index]} ${rounded} w-10 h-10"></span>`;
            });
            content += `</div>`;
        });
        content += `</div>`;
        return content;
    }

    private copyResults(copyButton: HTMLElement, data: any): void {
        let title: string;
        if (data.seeded)
            title = "Isaaconnect #" + StorageManager.lastIsaaconnect;
        else
            title = "I finished a random Isaaconnect!"
        try
        {
            let textToCopy = "";
            textToCopy = title + "\n";

            let health = StorageManager.health;
            
            if (typeof health != "number")
            {
                this.showMessage("Impossible to copy the results");
                return;
            }

            let groupFound = StorageManager.groupFound
            
            textToCopy += `✅: ${groupFound}/${Constants.NUMBER_OF_GROUPS} 💔: ${Constants.MAX_HEALTH - health}\n`;

            let attempts = StorageManager.attempts;

            attempts.forEach((attempt, index) => {
                attempt.forEach((group: {index: number}, index_group: number) => {
                    let index = group.index;
                    switch (index)
                    {
                        case 0:
                            textToCopy += "🟥";
                            break;
                        case 1:
                            textToCopy += "🟦";
                            break;
                        case 2:
                            textToCopy += "🟩";
                            break;
                        case 3:
                            textToCopy += "🟨";
                            break;
                    }
                });
                textToCopy += "\n";
            });

            if (StorageManager.link)
            {
                textToCopy += Constants.URL;
            }

            navigator.clipboard.writeText(textToCopy);
            copyButton.innerHTML = `<span class="material-symbols-outlined align-bottom">check</span>Copied!`;
            this.showMessage("Results copied to clipboard");
        }
        catch (error)
        {
            this.showMessage("Impossible to copy the results");
        }
    }

    public displayModal() {
        let modalContainer = document.querySelector<HTMLElement>('#modal-wrapper')!;
        modalContainer.classList.remove('hidden');
    }

    public async animate(): Promise<void> {
        let indexContains = [];
        let numberAlreadySelected = 0;
        let selected = document.querySelectorAll<HTMLElement>('.card-module--selected');

        if (selected.length == Constants.NUMBER_OF_ITEMS && this.itemsContainer.children.length != Constants.NUMBER_OF_ITEMS) {
            for (let i = 0; i < Constants.NUMBER_OF_ITEMS; i++) {
                let item = this.itemsContainer.children[i];
                let isNotSelected = !item.classList.contains('card-module--selected');
                if(isNotSelected) {
                    indexContains.push(i);
                }
            }

            numberAlreadySelected = Constants.NUMBER_OF_ITEMS - indexContains.length;

            for (let i = 0; i < indexContains.length; i++) {
                let index = indexContains[i];
                let elem = this.itemsContainer.children[index];
                swapUI(selected[numberAlreadySelected + i] as HTMLElement, elem as HTMLElement);
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    public setController(controller: MainGameController): void {
        this.controller = controller;
    }

}