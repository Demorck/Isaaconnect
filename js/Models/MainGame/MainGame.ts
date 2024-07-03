import { Constants } from "../../Helpers/Constants.js";
import { StorageManager } from "../../Helpers/Data/StorageManager.js";
import { Utils } from "../../Helpers/Utils.js";
import { Observable } from "../Observable.js";
import { GroupGame } from "./GroupGame.js";
import { Group } from "../Group.js";
import { GameUtils } from "./GameUtils.js";
import { MainGameMechanics } from "./MainGameMechanics.js";
import { Item } from "../Item.js";

export class MainGame extends Observable {
    private health: number;
    private groups: GroupGame[];
    private attempts: Group[][];
    private history: Item[][];
    private currentAttempt: number;

    private mechanics: MainGameMechanics;

    constructor() {
        super();
        this.health = Constants.MAX_HEALTH;
        this.attempts = [];
        this.history = [];
        this.currentAttempt = 0;
        this.groups = [];
        this.mechanics = new MainGameMechanics();
        
        this.setupGame();
    }

    private setupGame() : void {
        const lastIsaaconnect = StorageManager.lastIsaaconnect;
        if(lastIsaaconnect !== Utils.getDaysSince())
            StorageManager.newIsaaconnect();

        let bannedGroups: Group[] = [];
        for (let i = 1; i <= Constants.NUMBER_OF_DAYS_BEFORE; i++) {
            const selectedGroups = GameUtils.generateSelection(i);
            selectedGroups.forEach(group => bannedGroups.indexOf(group) === -1 ? bannedGroups.push(group) : null);
        }

        this.groups = GameUtils.generateSelection(0, bannedGroups);
    }

    public getGroups(): GroupGame[] {
        return this.groups.slice();
    }

    public handleSubmit(selectedID: number[]) {
        let results = this.mechanics.handleSubmit(selectedID, this.getGroups());
        
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
            StorageManager.currentAttempt = this.currentAttempt;
            StorageManager.history = this.history;
            StorageManager.attempts = this.attempts;
        }
    }

    
    public checkFinished(): {finished: boolean, win: boolean} {
        let groupsSolved = this.getGroupSolved();
        let autocomplete = StorageManager.autocomplete;

        let finished = false;
        let win = false;
        if (this.health <= 0) {
            let solved = groupsSolved.length;
            this.autocomplete();
            this.notifyObservers({ isFinished: true, win: win, solved: solved, losses: StorageManager.losses });
            finished = true
        } else {
            win = true;
            if (autocomplete && groupsSolved.length == Constants.NUMBER_OF_GROUPS - 1) {
                this.autocomplete();
                finished = true;
            } else if (groupsSolved.length == Constants.NUMBER_OF_GROUPS) finished = true;

            if (finished) {
                let mistakes = Constants.MAX_HEALTH - this.health;
                let title = Constants.WIN_MESSAGES[mistakes];
                this.notifyObservers({ isFinished: true, win: win, health: this.health, title: title, mistakes: mistakes, streak: StorageManager.winStreak});

            }
        }

        return {finished, win};
    }

    private wrongAnswer(selectedID: number[]) {        
        this.health--;
        StorageManager.health = this.health;
        
        this.groups.forEach(group => {
            for (const item of group) {
                if (selectedID.includes(item.getId())) {
                    item.wrongAnswer();
                }
            }
        });

        this.notifyObservers();
    }

    private rightAnswer(group: GroupGame) {
        group.setSolved();
        StorageManager.groupsSolved = this.getGroupSolved();

        this.notifyObservers({ deselect: true });
    }

    private getGroupSolved() : GroupGame[] {
        let groupSolved = this.groups.filter(group => group.isSolved());
        return groupSolved;
    }

    private autocomplete() {
        let groupSolved = this.getGroupSolved();
        let groupNotSolved = this.groups.filter(group => !group.isSolved());
        let selectedIDs: number[] = [];

        groupNotSolved.forEach(group => {
            this.rightAnswer(group)
        });
    }

    public assignStorageToGame() {
        const localHealth = StorageManager.health;
        if (localHealth !== null) this.health = localHealth

        const localGroupSolved = StorageManager.groupsSolved;
        if (localGroupSolved.length > 0) {
            this.groups.forEach(group => {        
                console.log(document.querySelectorAll('.card-module'));
                console.log(localGroupSolved, group.getData());
                localGroupSolved.forEach(groupSolved => {
                    if(groupSolved.name === group.getName()) this.rightAnswer(group)
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
    }

}