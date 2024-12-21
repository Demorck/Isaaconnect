import { MainGame } from "@/MainGame/Models/MainGame";
import { MainGameView } from "@/MainGame/Views/MainGameView";
import { GroupGameController } from "@/MainGame/Controllers/GroupGameController";
import { GroupGameView } from "@/MainGame/Views/GroupGameView";
import { Utils } from "@/Shared/Helpers/Utils";
import { Constants } from "@/Shared/Helpers/Constants";
import { StorageManager } from "@/Shared/Helpers/Data/StorageManager";
import { GroupGame } from "@/MainGame/Models/GroupGame";
import { GameOptions } from "@/MainGame/Models/GameOptions";

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
            if (Constants.OPTIONS.SEEDED) this.gameView.updateTimer(StorageManager.timer);
        } else {
            this.game.initializeTimer();
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

        if (typeof window.DeviceMotionEvent != 'undefined') {
            let sensitivity = 20;
        
            let x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;
        
            window.addEventListener('devicemotion', function (e) {
                if (e.accelerationIncludingGravity == null) return;
                x1 = e.accelerationIncludingGravity.x!;
                y1 = e.accelerationIncludingGravity.y!;
                z1 = e.accelerationIncludingGravity.z!;
            }, false);
        
            setInterval(() => {
                let change = Math.abs(x1-x2 + y1-y2 + z1-z2);
        
                if (change > sensitivity) {
                    this.shuffleCard();
                }
        
                x2 = x1;
                y2 = y1;
                z2 = z1;
            }, 300);
        }

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

        let buttonDeselect = document.querySelector('button[data-id="deselect"]');
        if (buttonDeselect) buttonDeselect.addEventListener('click', () => this.gameView.deselectCards());

        if (!Constants.OPTIONS.SEEDED) {
            let buttonPlay = document.querySelector('button[data-id="play-again"]')!;
            buttonPlay.classList.remove('button--disabled', 'hidden');
            buttonPlay.addEventListener('click', () => this.resetGame());

            let buttonChangeSettings = document.querySelector('button[data-id="change-settings"]')!;
            buttonChangeSettings.classList.remove('button--disabled', 'hidden');
            buttonChangeSettings.addEventListener('click', () => location.href = '/settings');
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

        this.gameView.revealBlindItems();
        
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
        document.getElementById('cards-win')?.classList.add('flex-1');
        document.querySelector('.health')?.classList.add('hidden');
    }

    /**
     * Removes the shuffle and submit buttons.
     *
     * @private
     * @returns {void}
     */
    private removeButtons(): void {
        let shuffleButton = document.querySelector('[data-id="shuffle"]')!;
        shuffleButton?.classList.add("hidden");

        let buttons = document.getElementById('buttons-ingame')!;
        buttons.classList.add("hidden");

        buttons = document.getElementById('buttons-finished')!;
        buttons.classList.remove("hidden");

        if (!Constants.OPTIONS.SEEDED) {
            let buttonPlay = document.querySelector('button[data-id="play-again"]')!;
            buttonPlay.classList.remove('hidden');

            let buttonChangeSettings = document.querySelector('button[data-id="change-settings"]')!;
            buttonChangeSettings.classList.remove('hidden');
        }   
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
