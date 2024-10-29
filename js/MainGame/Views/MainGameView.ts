import { Observer } from "../../Shared/Views/Observer.js";
import { StorageManager } from "../../Shared/Helpers/Data/StorageManager.js";
import { Constants } from "../../Shared/Helpers/Constants.js";
import { Utils } from "../../Shared/Helpers/Utils.js";
import { swapUI } from "../Controllers/Animation.js";
import { MainGameController } from "../Controllers/MainGameController.js";
import { GroupGame } from "../Models/GroupGame.js";
import { GroupData } from "../../Shared/Helpers/Data/GroupData.js";
import { GameOptions } from "../Models/GameOptions.js";

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

        if (data.disabled)
            this.toggleSubmitButton(data.disabled);

        if (data.animate)
        {            
            let group: GroupGame = data.group;
            let itemsID: number[] = group.getSelectedItems().map(item => item.getId());
            let selected = document.querySelectorAll<HTMLElement>('.card-module--selected');
            let deselect = false;
            selected.forEach((el: HTMLElement) => {
                let id = Number(el.dataset.id);
                if (!itemsID.includes(id)) deselect = true;
            })

            if (deselect) selected.forEach(el => {el.classList.remove('card-module--selected'); el.classList.add('card-module--disabled')});

            itemsID.forEach((id, index) => {
                let item = document.querySelector<HTMLElement>(`[data-id="${id}"]`);
                item?.classList.add('card-module--selected');
            });

            this.animate().then(async () => {
                await this.controller.toggleGroupSolved(data.group);
                let cards = document.querySelectorAll<HTMLElement>('.card-module');
                if (cards.length == Constants.OPTIONS.NUMBER_OF_ITEMS)
                {
                    cards.forEach(card => {
                        card.style.transform = `translate(0px, $0px)`;
                    });
                }
                
                if (data.deselect) this.deselectCards();
            });
        }
        
        if (data.isFinished && data.autocomplete || data.isFinished && data.win) {
            Utils.sleep(1000).then(() => {
                console.log(data);
                
                data.streak = StorageManager.winStreak;
                data.losses = StorageManager.losses;                
                this.controller?.toggleFinishedState();
                this.toggleFinishedState(data);
            });
        }

        this.renderHealth(data.health);
        this.applyBorderRadius();        
    }

    private toggleFinishedState(data: any): void {
        this.showResults(data.win, data).then(html => {
            let modalContainer = document.querySelector<HTMLElement>('#modal-wrapper')!; 
            modalContainer.innerHTML = html;
            modalContainer.classList.remove('hidden');

            let buttons = document.getElementById('buttons-finished')!;
            buttons.classList.add("-z-10");

            // TODO: A mettre dans le controller
            document.querySelector('.close-button')!.addEventListener('click', () => {
                modalContainer.classList.add('hidden');
                let buttons = document.getElementById('buttons-finished')!;
                buttons.classList.remove("-z-10");
            });
            document.querySelector('[data-id="results-wrapper"]')!.innerHTML = this.convertAttemptToSquareMatrix(data.attempts);
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
        if (health < 0 || health == undefined) return;
        this.healthContainer.innerHTML = '';
        let container = this.healthContainer;
            let div = document.createElement('div');
            div.classList.add('flex', 'flex-row', 'justify-center', 'items-center');
            container = this.healthContainer.appendChild(div);
        
        for (let i = 1; i <= health; i++){
            container.innerHTML += `<img src="/assets/gfx/heart.png" alt="heart" data-type="health">`;
            
            if (i == 6) {
                let div = document.createElement('div');
                div.classList.add('flex', 'flex-row', 'justify-center', 'items-center');
                container = this.healthContainer.appendChild(div);
            }
        }

        for (let i = health + 1; i <= Constants.OPTIONS.HEALTH; i++){
            container.innerHTML += `<img src="/assets/gfx/empty heart.png" alt="empty heart" data-type="empty">`;

            if (i == 6) {
                let div = document.createElement('div');
                div.classList.add('flex', 'flex-row', 'justify-center', 'items-center');
                container = this.healthContainer.appendChild(div);
            }
        }
    }

    
    /**
     * @description Toggles the submit button
     *
     * @public
     * @param {boolean} disabled - True if the button should be disabled, false otherwise
     */
    public toggleSubmitButton(disabled: boolean): void {
        const submitButton = document.querySelector<HTMLButtonElement>('[data-id="submit"]');
        if (submitButton == null) return;

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
        let options: GameOptions = Constants.OPTIONS;
        labels.forEach((label, index) => {
            label.classList.remove('rounded-tl-3xl', 'rounded-tr-3xl', 'rounded-bl-3xl', 'rounded-br-3xl');
            if (index === 0) label.classList.add('rounded-tl-3xl');
            if (index === options.NUMBER_OF_ITEMS - 1) label.classList.add('rounded-tr-3xl');
            if (index === labels.length - options.NUMBER_OF_ITEMS) label.classList.add('rounded-bl-3xl');
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
        if (data.seeded)
        {
            if (win) modalPath = "/include/modals/results/win.html";
            else modalPath = "/include/modals/results/lose.html";

        } else {
            if (win) modalPath = "/include/modals/results/win random.html";
            else modalPath = "/include/modals/results/lose random.html";
            
        }
        let html = await Utils.loadHTML(modalPath);
        
        html = Utils.replacePlaceholders(html, data);
        return html;
    }

    private convertAttemptToSquareMatrix(attempt: GroupData[][]): string {
        let content = `<div data-id="results" class="flex flex-col">`;
        let mobileSquare = window.screen.width < 768 ? "w-7 h-7" : "w-10 h-10";
        attempt.forEach((group, index_attempt) => {
            content += `<div data-id="results-attempt-${index_attempt}" class="flex justify-center items-center">`;
            group.forEach((currentGroup, index_group) => {
                let index = currentGroup.index;
                let rounded = index_group % Constants.OPTIONS.NUMBER_OF_ITEMS == 0 ? "rounded-l-lg" : index_group % Constants.OPTIONS.NUMBER_OF_ITEMS == Constants.OPTIONS.NUMBER_OF_ITEMS - 1 ? "rounded-r-lg" : "";
                content += `<span data-id="results-attempt-${index_attempt}-item-${index_group}-group-${index}" class="bg-${Constants.COLORS[index]} ${rounded} ${mobileSquare}"></span>`;
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
            let health = data.health;
            
            if (typeof health != "number")
            {
                this.showMessage("Impossible to copy the results");
                return;
            }

            let groupFound = data.groupFound;            
            
            textToCopy += `✅: ${groupFound}/${Constants.OPTIONS.NUMBER_OF_GROUPS} ❤️: ${health}/${Constants.OPTIONS.HEALTH}\n`;

            let attempts: GroupData[][] = data.attempts;
            attempts.forEach((attempt, _index) => {
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
                        case 4:
                            textToCopy += "🟪";
                            break;
                        case 5:
                            textToCopy += "🟧";
                            break;
                        case 6:
                            textToCopy += "🟫";
                            break;
                        case 7:
                            textToCopy += "⬜";
                            break;
                        default:
                            textToCopy += "⬛";
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

        let buttons = document.getElementById('buttons-finished')!;
        buttons.classList.add("-z-10");
    }

    public async animate(): Promise<void> {
        let indexContains = [];
        let numberAlreadySelected = 0;
        let selected = document.querySelectorAll<HTMLElement>('.card-module--selected');

        if (selected.length == Constants.OPTIONS.NUMBER_OF_ITEMS && this.itemsContainer.children.length != Constants.OPTIONS.NUMBER_OF_ITEMS) {
            for (let i = 0; i < Constants.OPTIONS.NUMBER_OF_ITEMS; i++) {
                let item = this.itemsContainer.children[i];
                let isNotSelected = !item.classList.contains('card-module--selected');
                if(isNotSelected) {
                    indexContains.push(i);
                }
            }

            numberAlreadySelected = Constants.OPTIONS.NUMBER_OF_ITEMS - indexContains.length;

            for (let i = 0; i < indexContains.length; i++) {
                let index = indexContains[i];
                let elem = this.itemsContainer.children[index];
                try {
                    swapUI(selected[numberAlreadySelected + i] as HTMLElement, elem as HTMLElement);
                } catch (ignored) {}
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    public setController(controller: MainGameController): void {
        this.controller = controller;
    }

    public getMainContainer(): HTMLElement {
        return this.container;
    }

    public clearGrid(): void {
        this.itemsContainer.classList.remove('hidden');
        document.querySelector('.health')?.classList.remove('hidden');
        this.groupsContainer.classList.add('hidden');

        let shuffleButton = document.querySelector('.shuffle-mobile');
        shuffleButton?.classList.remove("hidden");

        let buttons = document.getElementById('buttons-ingame')!;
        buttons.classList.remove("hidden");

        buttons = document.getElementById('buttons-finished')!;
        buttons.classList.add("hidden");

        let modal = document.querySelector<HTMLElement>('#modal-wrapper')!;
        modal.classList.add('hidden');
        

        this.itemsContainer.innerHTML = '';
        this.healthContainer.innerHTML = '';
        this.groupsContainer.innerHTML = '';
    }

}