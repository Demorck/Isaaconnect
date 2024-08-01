import { MainGame } from "../Models/MainGame.js";
import { MainGameView } from "../Views/MainGameView.js";
import { GroupGameController } from "./GroupGameController.js";
import { GroupGameView } from "../Views/GroupGameView.js";
import { Utils } from "../../Shared/Helpers/Utils.js";
import { Constants } from "../../Shared/Helpers/Constants.js";
import { StorageManager } from "../../Shared/Helpers/Data/StorageManager.js";
import { GroupGame } from "../Models/GroupGame.js";
import { GameOptions } from "../Models/GameOptions.js";

/**
 * MainGameController class that controls the main game (Isaaconnect).
 *
 * @export
 * @class MainGameController
 */
export class MainGameController {
    private game: MainGame;
    private gameView: MainGameView;
    private gameOptions: GameOptions;
    private itemsIndex: number[] = [];
    private groupsController: GroupGameController[] = [];

    /**
     * Creates an instance of MainGameController.
     * @param {MainGame} game - The main game model.
     * @param {MainGameView} view - The main game view.
     */
    constructor(game: MainGame, view: MainGameView) {
        this.game = game;
        this.gameView = view;
        this.gameView.setController(this);
        this.gameOptions = Constants.OPTIONS;

        this.itemsIndex = Array.from({ length: Constants.NUMBER_OF_GROUPS * Constants.NUMBER_OF_ITEMS }, (_, i) => i);

        this.initializeGroups();
        
        this.addEventListeners();
        this.game.addObserver(this.gameView);
        if (this.game.isSeeded())
            this.game.assignStorageToGame();
        let { finished, win } = this.game.checkFinished();

        if (finished) {
            this.incrementStats(win);
            this.toggleFinishedState();
        }
        
        this.game.setupFinished();
        this.modifyWithOptions();
    }

    /**
     * Shuffles the cards.
     * @public
     * @returns {void}
     */
    public shuffleCard = (): void => {
        let container = this.gameView.getItemsContainer();
        let labels = Array.from(document.querySelectorAll('.card-module'));
        container.innerHTML = '';
        Utils.shuffleArray(labels).forEach(label => container.appendChild(label));
        this.game.notifyObservers();
    }

    private initializeGroups() {
        this.groupsController = [];
        
        this.game.getGroups().forEach(group => {
            let groupView = new GroupGameView('#cards-win');
            this.groupsController.push(new GroupGameController(group, groupView, this.gameOptions));
        });

        let checkboxes = document.querySelectorAll<HTMLInputElement>('.card-module input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (event) => this.checkboxChangeHandler(event, checkboxes));
        });
        
        this.shuffleCard();
    }

    /**
     * Toggles the solved state of the group.
     *
     * @public
     * @async
     * @param {GroupGame} group - The group to toggle the solved state for.
     * @returns {Promise<void>}
     */
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

    /**
     * Adds event listeners to the checkboxes, shuffle button, and submit button.
     *
     * @private
     * @returns {void}
     */
    private addEventListeners(): void {        
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

        let buttonResults = document.querySelector('button[data-id="results"]')!;
        buttonResults.classList.remove('button--disabled');
        buttonResults.addEventListener('click', () => this.gameView.displayModal());

        if (!Constants.OPTIONS.SEEDED) {
            let buttonPlay = document.querySelector('button[data-id="play-again"]')!;
            buttonPlay.classList.remove('button--disabled', 'hidden');
            buttonPlay.addEventListener('click', () => this.resetGame());
        }
    }

    /**
     * Handles checkbox change events.
     * TODO:
     *
     * @private
     * @param {Event} event - The change event.
     * @param {NodeListOf<HTMLInputElement>} checkboxes - The list of checkboxes.
     * @returns {void}
     */
    private checkboxChangeHandler = (event: Event, checkboxes: NodeListOf<HTMLInputElement>): void => {
        let numberSelected = document.querySelectorAll('.card-module--selected').length;
        if (numberSelected == this.gameOptions.NUMBER_OF_ITEMS) {
            checkboxes.forEach(otherCheckbox => {
                let element = otherCheckbox.parentNode as Element;
                if (!element.classList.contains('card-module--selected')) {
                    element.classList.add('card-module--disabled');
                    otherCheckbox.disabled = true;
                }
            });

            this.gameView.toggleSubmitButton(false);
        } else {
            checkboxes.forEach(otherCheckbox => {
                let element = otherCheckbox.parentNode as Element;
                element.classList.remove('card-module--disabled');
                otherCheckbox.disabled = false;
            });

            this.gameView.toggleSubmitButton(true);
        }
    }

    /**
     * Handles the submit action.
     *
     * @private
     * @returns {void}
     */
    private handleSubmit(): void {
        let selectedItemsID: number[] = [];
        let elements = document.querySelectorAll<HTMLElement>('.card-module--selected');
        elements.forEach(element => {
            selectedItemsID.push(Number(element.dataset.id));
        });
        
        this.game.handleSubmit(selectedItemsID);
        let { finished, win } = this.game.checkFinished();

        if (finished) {
            this.incrementStats(win);
        }
    }

    /**
     * Toggles the finished state of the game.
     *
     * @public
     * @returns {void}
     */
    public toggleFinishedState = (): void => {
        if (!StorageManager.finished) {
            StorageManager.finished = true;
        }

        this.removeButtons();
        document.getElementById('cards-module')?.classList.add('hidden');
        document.querySelector('.health')?.classList.add('hidden');
    }

    /**
     * Removes the shuffle and submit buttons.
     *
     * @private
     * @returns {void}
     */
    private removeButtons(): void {
        let shuffleButton = document.querySelector('.shuffle-mobile');
        shuffleButton?.classList.add("hidden");

        let buttons = document.getElementById('buttons-ingame')!;
        buttons.classList.add("hidden");

        buttons = document.getElementById('buttons-finished')!;
        buttons.classList.remove("hidden");
    }

    /**
     * Increments the game statistics.
     *
     * @private
     * @param {boolean} win - Whether the game was won.
     * @returns {void}
     */
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

    private modifyWithOptions(): void {
        let itemsContainer = this.gameView.getItemsContainer();
        itemsContainer.classList.remove('grid-cols-4');
        itemsContainer.classList.add(`grid-cols-${this.gameOptions.NUMBER_OF_ITEMS}`);
        
        if (window.innerWidth > 768) {
            let container = this.gameView.getMainContainer();
            let width = 110 * (this.gameOptions.NUMBER_OF_ITEMS + 1);
            container.style.width = width + 'px';

            // let cards = document.querySelectorAll<HTMLElement>('.card-module');
            // cards.forEach(card => {
            //     card.style.flexBasis = `calc(100% / ${this.gameOptions.NUMBER_OF_ITEMS + 1})`;
            // });
        }
    }

    public getGameOptions(): GameOptions {
        return this.gameOptions;
    }

    private resetGame(): void {
        this.gameView.clearGrid();
        this.gameView.toggleSubmitButton(true);

        this.game.resetGame();
        this.initializeGroups();
        this.game.setupFinished();
    }
}
