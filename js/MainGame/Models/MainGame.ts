import { Constants } from "../../Shared/Helpers/Constants.js";
import { StorageManager } from "../../Shared/Helpers/Data/StorageManager.js";
import { Utils } from "../../Shared/Helpers/Utils.js";
import { Observable } from "../../Shared/Models/Observable.js";
import { GroupGame } from "./GroupGame.js";
import { Group } from "../../Shared/Models/Group.js";
import { GameUtils } from "./GameUtils.js";
import { MainGameMechanics } from "./MainGameMechanics.js";
import { Item } from "../../Shared/Models/Item.js";
import { GameOptions } from "./GameOptions.js";

/**
 * Represents the main game logic and state.
 * 
 * @export
 * @class MainGame
 * @extends {Observable}
 */
export class MainGame extends Observable {
    private health: number;
    private groups: GroupGame[];
    private attempts: Group[][];
    private history: Item[][];
    private groupFound: number;
    private currentAttempt: number;
    
    private timer: number;
    private startTime: number;

    // TODO: Modifier le seeded pour que ça prenne depuis la constante qu'ici
    private seeded: boolean;

    private mechanics: MainGameMechanics;
    private utils: GameUtils;

    /**
     * Creates an instance of MainGame.
     * @param {boolean} [seeded=true] - Whether the game uses seeded randomization.
     * @param {boolean} [blind=false] - Whether the game is in blind mode.
     */
    constructor(seeded = true) {
        super();
        this.seeded = seeded;
        Constants.OPTIONS = this.generateOptions();
        this.attempts = [];
        this.history = [];
        this.currentAttempt = 0;
        this.groupFound = 0;
        this.groups = [];
        this.mechanics = new MainGameMechanics();
        this.utils = new GameUtils(Constants.OPTIONS);
        this.health = Constants.OPTIONS.HEALTH;

        if (Constants.OPTIONS.SEEDED && StorageManager.lastIsaaconnect == Utils.getDaysSince()) {
            this.timer = StorageManager.timer;
        } else {
            this.timer = 0;
        }
        this.startTime = Date.now() - this.timer;

        this.setupGame();
    }

    /**
     * Sets up the game by generating the initial groups.
     * @private
     * @memberof MainGame
     */
    private setupGame() : void {
        let bannedGroups: Group[] = [];
        if (this.seeded) {
            const lastIsaaconnect = StorageManager.lastIsaaconnect;
            if(lastIsaaconnect !== Utils.getDaysSince())
                StorageManager.newIsaaconnect();

            for (let i = 1; i <= Constants.NUMBER_OF_DAYS_BEFORE; i++) {
                const selectedGroups = this.utils.whileSelection(i);
                selectedGroups.forEach(group => bannedGroups.indexOf(group) === -1 ? bannedGroups.push(group) : null);
            }
            
            this.groups = this.utils.whileSelection(0, bannedGroups);
        } else {
            this.groups = this.utils.whileSelection(0, bannedGroups);
        }
    }

    /**
     * Initializes the game timer.
     * @private
     * @memberof MainGame
     */
    public initializeTimer() {
        let interval = setInterval(() => {
            if (this.health <= 0) clearInterval(interval);
            if (this.groupFound === Constants.OPTIONS.NUMBER_OF_GROUPS) clearInterval(interval);
            
            this.timer = Date.now() - this.startTime;

            if (Constants.OPTIONS.SEEDED)
                StorageManager.timer = this.timer;

            this.notifyObservers({ timer: this.timer });
        }, 1);
    }

    /**
     * Notifies observers that setup is finished.
     * @memberof MainGame
     */
    public setupFinished() {        
        this.initializeTimer();
        this.notifyObservers({ health: this.health });
    }

    /**
     * Gets the current groups in the game.
     * @returns {GroupGame[]} The current groups.
     * @memberof MainGame
     */
    public getGroups(): GroupGame[] {
        return this.groups.slice();
    }

    /**
     * Handles the submission of selected item IDs.
     * @param {number[]} selectedID - The selected item IDs.
     * @memberof MainGame
     */
    public handleSubmit(selectedID: number[]) {
        let results = this.mechanics.handleSubmit(selectedID, this.getGroups(), this.history, Constants.OPTIONS);
        
        let win = results.win;
        let attempts = results.attempts;
        let historyItems = results.historyItems;
        let isMessage = results.isMessage;
        let message = results.message;

        if (isMessage) {
            this.notifyObservers({ isMessage, message });
        }
        
        if (attempts && historyItems) {
            this.attempts.push(attempts);
            this.history.push(historyItems);
            
            if (win) {
                let groupSolved = GameUtils.findGroupByItem(historyItems[0], this.groups);
                this.rightAnswer(groupSolved);
            } else {
                this.wrongAnswer(selectedID);
            }

            this.currentAttempt++;
            if (this.seeded) {
                StorageManager.currentAttempt = this.currentAttempt;
                StorageManager.history = this.history;
                StorageManager.attempts = this.attempts;
            }
        }
    }

    /**
     * Checks if the game is finished and if the player won or lost.
     * @returns {{finished: boolean, win: boolean}} The game status.
     * @memberof MainGame
     */
    public checkFinished(): {finished: boolean, win: boolean} {
        let groupsSolved = this.getGroupSolved();
        let autocomplete = StorageManager.autocomplete;

        let finished = false;
        let win = false;
        if (this.health <= 0) {
            this.autocomplete();
            this.notifyObservers(this.getNotifyData(win));
            finished = true
        } else {
            win = true;
            if (autocomplete && groupsSolved.length == Constants.OPTIONS.NUMBER_OF_GROUPS - 1) {
                this.autocomplete(true);
                finished = true;
            } else if (groupsSolved.length == Constants.OPTIONS.NUMBER_OF_GROUPS) finished = true;

            if (finished && !autocomplete) {
                this.notifyObservers(this.getNotifyData(win));
            }
        }

        return {finished, win};
    }

    /**
     * Constructs the notification data for observers.
     * @private
     * @param {boolean} win - Whether the game was won.
     * @param {boolean} [autocomplete=false] - Whether the game was autocompleted.
     * @returns {any} The notification data.
     * @memberof MainGame
     */
    private getNotifyData(win: boolean, autocomplete: boolean = false): any {
        if (win) {
            let mistakes = Constants.OPTIONS.HEALTH - this.health;
            if (!Constants.OPTIONS.SEEDED) mistakes = Math.floor(mistakes / Constants.WIN_MESSAGES.length); 
            let title = Constants.WIN_MESSAGES[Math.floor(mistakes)];            
            
            return {
                autocomplete: autocomplete,
                isFinished: true,
                win: true,
                health: this.health,
                title: title,
                mistakes: mistakes,
                streak: StorageManager.winStreak,
                seeded: this.seeded,
                attempts: this.attempts,
                groupFound: this.groupFound,
                timer: this.timer,
            };
        } else {
            let solved = this.groupFound;
            return {
                autocomplete: autocomplete,
                isFinished: true,
                win: false,
                health: this.health,
                solved: solved,
                losses: StorageManager.losses,
                seeded: this.seeded,
                attempts: this.attempts,
                groupFound: this.groupFound,
                timer: this.timer,
            };
        }
    }

    /**
     * Handles a wrong answer submission.
     * @private
     * @param {number[]} selectedID - The selected item IDs.
     * @memberof MainGame
     */
    private wrongAnswer(selectedID: number[]) {        
        this.health--;
        if (this.seeded)
            StorageManager.health = this.health;
        
        this.groups.forEach(group => {
            for (const item of group) {
                if (selectedID.includes(item.getId())) {
                    item.wrongAnswer();
                }
            }
        });

        this.notifyObservers({health: this.health});
    }

    /**
     * Handles a correct answer submission.
     * @private
     * @param {GroupGame} group - The group that was correctly solved.
     * @param {boolean} [animate=true] - Whether to animate the solution.
     * @memberof MainGame
     */
    private rightAnswer(group: GroupGame, animate: boolean = true) {
        this.groupFound++;
        group.setSolved();
        
        if (this.seeded) {
            StorageManager.groupFound = this.groupFound;
            StorageManager.groupsSolved = this.getGroupSolved();
        }

        this.notifyObservers({ deselect: true, animate: animate, group: group, disabled: true });
    }

    /**
     * Gets the groups that have been solved.
     * @private
     * @returns {GroupGame[]} The solved groups.
     * @memberof MainGame
     */
    private getGroupSolved() : GroupGame[] {
        let groupSolved = this.groups.filter(group => group.isSolved());
        return groupSolved;
    }

    /**
     * Autocompletes the game if necessary.
     * @private
     * @param {boolean} [win=false] - Whether the game was won.
     * @memberof MainGame
     */
    private autocomplete(win: boolean = false) {
        let groupSolved = this.getGroupSolved();
        let groupNotSolved = this.groups.filter(group => !group.isSolved());
        let selectedIDs: number[] = [];

        groupNotSolved.reduce((promiseChain, group, index) => {
            let time = 1000; 
            return promiseChain.then(() => Utils.sleep(time).then(() => {
                for (const item of group) {
                    selectedIDs.push(item.getId());
                }
                if (win) {
                    this.handleSubmit(selectedIDs);
                } else {
                    this.notifyObservers({ deselect: true, animate: true, group: group });                    
                    if (this.seeded)
                        StorageManager.groupsSolved = this.getGroupSolved();
                }
            }));
        }, Promise.resolve()).then(() => {
            this.notifyObservers(this.getNotifyData(win, true));
            return Utils.sleep(1000);
        }).then(() => {
            Promise.resolve();
        });
    }

    private generateOptions(): GameOptions {
        let options: GameOptions = {
            NUMBER_OF_GROUPS: this.seeded ? Constants.NUMBER_OF_GROUPS : StorageManager.numberOfGroups,
            NUMBER_OF_ITEMS: this.seeded ? Constants.NUMBER_OF_ITEMS : StorageManager.numberOfItems,
            SEEDED: this.seeded,
            HEALTH: this.seeded ? Constants.MAX_HEALTH : StorageManager.randomHealth,
            NUMBER_OF_BLIND_ITEMS: this.seeded ? 0 : StorageManager.numberOfBlindItems,
            TAGS_BANNED: this.seeded ? true : StorageManager.bannedTags,
            CUSTOM_DIFFICULTY: this.seeded ? Constants.DEFAULT_DIFFICULTY : StorageManager.customDifficulty,
            CHECK_GRID: this.seeded ? true : StorageManager.checkGrid,
        };

        return options;
    }

    /**
     * Assigns the saved game state to the current game.
     * @memberof MainGame
     */
    public assignStorageToGame() {
        const localHealth = StorageManager.health;
        if (localHealth !== null) this.health = localHealth;

        const localGroupSolved = StorageManager.groupsSolved;
        if (localGroupSolved.length > 0) {
            this.groups.forEach(group => {        
                localGroupSolved.forEach(groupSolved => {
                    if(groupSolved.name === group.getName()) {
                        group.setSolved(true, true);
                    }
                });
            });
        }

        const localAttempts = StorageManager.attempts;
        if (localAttempts.length > 0) {
            localAttempts.forEach(attempt => {
                let attemptGroup: GroupGame[] = [];
                attempt.forEach(group => {
                    this.groups.filter(g => g.getName() === group.name).forEach(g => {
                        attemptGroup.push(g);
                    });
                });
                this.attempts.push(attemptGroup);
            });
            this.currentAttempt = this.attempts.length;
        }

        const localHistory = StorageManager.history;
        if (localHistory.length > 0) {
            localHistory.forEach(items => {
                let historyItems: Item[] = [];
                items.forEach(item => {
                    this.groups.forEach(group => {
                        group.forEach(i => {
                            if (i.getId() === item.id) historyItems.push(i);
                        });
                    });
                });
                this.history.push(historyItems);
            });
        }     
        
        const localGroupFound = StorageManager.groupFound;
        if (localGroupFound !== null) this.groupFound = localGroupFound;

        const localTimer = StorageManager.timer;
        if (localTimer !== null) this.timer = localTimer;
    }

    /**
     * Checks if the game is seeded.
     * @returns {boolean} Whether the game is seeded.
     * @memberof MainGame
     */
    public isSeeded(): boolean {
        return this.seeded;
    }

    /**
     * Gets the current health of the player.
     * @returns {number} The current health.
     * @memberof MainGame
     */
    public getHealth(): number {
        return this.health;
    }

    public resetGame(): void {
        this.seeded = Constants.OPTIONS.SEEDED;
        Constants.OPTIONS = this.generateOptions();
        this.attempts = [];
        this.history = [];
        this.currentAttempt = 0;
        this.groupFound = 0;
        this.groups = [];
        this.mechanics = new MainGameMechanics();
        this.utils = new GameUtils(Constants.OPTIONS);
        this.health = Constants.OPTIONS.HEALTH;
        this.timer = 0;
        this.startTime = Date.now() - this.timer;

        this.setupGame();        
    }
}
