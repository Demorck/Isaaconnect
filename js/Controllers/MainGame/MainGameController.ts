import { MainGame } from "../../Models/MainGame/MainGame.js";
import { MainGameView } from "../../Views/MainGame/MainGameView.js";
import { GroupGameController } from "./GroupGameController.js";
import { GroupGameView } from "../../Views/MainGame/GroupGameView.js";
import { Utils } from "../../Helpers/Utils.js";
import { Constants } from "../../Helpers/Constants.js";
import { StorageManager } from "../../Helpers/Data/StorageManager.js";
import { swapUI } from "./Animation.js";
import { GroupGame } from "../../Models/MainGame/GroupGame.js";


/**
 * @description MainGameController class that controls the main game (Isaaconnect).
 *
 * @export
 * @class MainGameController
 * @type {MainGameController}
 */
export class MainGameController {
    private game: MainGame;
    private gameView: MainGameView;
    private itemsIndex: number[] = [];
    private groupsController: GroupGameController[] = [];

    constructor(game: MainGame, view : MainGameView) {
        this.game = game;
        this.gameView = view

        this.itemsIndex = Array.from({ length: Constants.NUMBER_OF_GROUPS * Constants.NUMBER_OF_ITEMS }, (_, i) => i);

        this.game.getGroups().forEach(group => {
            let groupView = new GroupGameView('#cards-win');
            this.groupsController.push(new GroupGameController(group, groupView, this.game.getBlind()));
        });
        
        this.shuffleCard();
        this.addEventListeners();
        this.game.addObserver(this.gameView);
        if (this.game.isSeeded())
            this.game.assignStorageToGame();
        let {finished, win} = this.game.checkFinished();

        if (finished) {
            this.incrementStats(win)
            this.toggleFinishedState();
        }
        
        this.game.setupFinished();
        this.gameView.setController(this);
    }

    public shuffleCard = () => {
        let container = this.gameView.getItemsContainer();
        let labels = Array.from(document.querySelectorAll('.card-module'));
        container.innerHTML = '';
        Utils.shuffleArray(labels).forEach(label => container.appendChild(label));
        this.game.notifyObservers();
    }

    
    public async toggleGroupSolved(group: GroupGame): Promise<void> {
        return new Promise((resolve) => {
            for (let i = 0; i < this.groupsController.length; i++) {
                if (this.groupsController[i].getGroupName() === group.getName()) {
                    this.groupsController[i].toggleSolved();
                    break;
                }
            }
            this.gameView.applyBorderRadius();
            resolve();
        });
    }

    private addEventListeners(): void {        
        let checkboxes = document.querySelectorAll<HTMLInputElement>('.card-module input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (event) => this.checkboxChangeHandler(event, checkboxes));
        });

        let shuffleButton = document.querySelectorAll('[data-id="shuffle"]');
        shuffleButton.forEach(button => {
            button.addEventListener('click', this.shuffleCard);
        });

        let submitButton = document.querySelectorAll('[data-id="submit"]');
        submitButton.forEach(button => {
            button.addEventListener('click', e => {
                this.gameView.toggleSubmitButton(true);
                Utils.sleep(100).then(() =>
                    this.handleSubmit()
                );
            });
        });
    }

    private checkboxChangeHandler = (event: Event, checkboxes: NodeListOf<HTMLInputElement>) => {
        let numberSelected = document.querySelectorAll('.card-module--selected').length;
        if (numberSelected == 4) {
            checkboxes.forEach(otherCheckbox => {
                let element = otherCheckbox.parentNode as Element;
                if (!element.classList.contains('card-module--selected'))
                {
                    element.classList.add('card-module--disabled');
                    otherCheckbox.disabled = true;
                }
            })

            this.gameView.toggleSubmitButton(false);
        } else {
            checkboxes.forEach(otherCheckbox => {
                let element = otherCheckbox.parentNode as Element;
                element.classList.remove('card-module--disabled');
                otherCheckbox.disabled = false;
            })

            this.gameView.toggleSubmitButton(true);
        }
    }

    private handleSubmit(): void {
        let selectedItemsID: number[] = [];
        let elements = document.querySelectorAll<HTMLElement>('.card-module--selected');
        elements.forEach(element => {
            selectedItemsID.push(Number(element.dataset.id));
        });
        
        this.game.handleSubmit(selectedItemsID);
        let {finished, win} = this.game.checkFinished();

        if (finished) {
            this.incrementStats(win)
        }
    }

    public toggleFinishedState = () => {
        if (!StorageManager.finished)
        {
            StorageManager.finished = true;
        }

        this.removeButtons();
        document.getElementById('cards-module')?.remove();

        let buttonResults = document.querySelector('button[data-id="results"]')!;
        buttonResults.classList.remove('button--disabled');
        buttonResults.addEventListener('click', () => this.gameView.displayModal());
    }

    private removeButtons(): void {
        let shufflesButton = document.querySelectorAll('button[data-id="shuffle"]');
        shufflesButton.forEach(button => button.remove());

        let buttons = document.querySelector('.buttons')!;
        buttons.innerHTML = '<button data-id="results" class="button--submit font-bold py-2 px-4 rounded button--disabled">See results</button>';
    }

    private incrementStats(win: boolean): void {
        if (!this.game.isSeeded()) return;
        if (StorageManager.finished) return;
        let stats = StorageManager.stats;
        win ? stats.winStreak++ : stats.winStreak = 0;
        win ? stats.wins++ : stats.losses++;
        stats.longestStreak = Math.max(stats.longestStreak, stats.winStreak);
        StorageManager.finished = true;
        StorageManager.stats = stats;
    }
}
