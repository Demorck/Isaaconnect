"use strict";
import { Constants } from "../Helpers/Constants.js";
import { DataFetcher } from "../Helpers/DataFetcher.js";
import { StorageManager } from "../Helpers/Data/StorageManager.js";
import { UI } from "./UI.js";
import { Utils } from "../Helpers/Utils.js";


/**
 * @description The main class of the game
 *
 * @class Game
 * @typedef {Game}
 */
export class Game {
    

    
    /**
     * Assign the local storage values to the variables of the game
     */
    assignLocalStorageToVariables() {
        const localHealth = StorageManager.health;
        if (localHealth !== null) {
            this.health = parseInt(localHealth);
            this.UI.updateHealth(this.health);
        }

        const localGroupSolved = StorageManager.groupsSolved;
        if (localGroupSolved.length > 0) {
            localGroupSolved.forEach(currentGroup => {
                this.solveGroup(currentGroup);
                this.mapItemAndGroup.forEach((key, value) => {
                    if (currentGroup === key) this.mapItemAndGroup.delete(key);
                });
            });

            if (this.groupsSolved.length >= 4)
            {
                if (this.health > 0) this.win();
                else this.loose();
            }
        }

        const localAttempt = StorageManager.attempts;
        if (localAttempt.length > 0) {
            this.attempts = localAttempt;
            this.currentAttempt = this.attempts.length;
        }

        const localHistory = StorageManager.history;
        if (localHistory.length > 0) {
            this.history = localHistory;
        }
    }

    /**
     * Handle when the user click on the submit button.
     */
    handleSubmit = () => {
        if (!alreadyGuessed) {

            this.UI.removeDifficulty();

            StorageManager.history = this.history;
            StorageManager.attempts = this.attempts;
            StorageManager.currentAttempt = this.currentAttempt;
        } else {
            this.UI.showMessage("Already guessed!");
        }
    }

    /**
     * 
     * @param {String} group The group's name to solve
     */
    rightAnswer = (group) => {
        this.solveGroup(group);
        StorageManager.groupsSolved = this.groupsSolved;
        if (StorageManager.autocomplete && this.groupsSolved.length >= 3) {
            this.autocomplete().then(() => {
                this.win();
            });
        } else if (this.groupsSolved.length >= 4) {
            this.UI.toggleToSolvedGroup();
            Utils.sleep(1000).then(() => {
                this.win()
            });
        }
    }

    /**
     * Handle wrong answer
     * @param {Array} selectedItems The items selected by the user
     */
    wrongAnswer = (selectedItems) => {
        if (this.health <= 0) {
            this.autocomplete().then(() => {
                Utils.sleep(1000).then(() =>
                    this.loose()
                );
            });
        }
    }

    solveGroup = (group, autocompleted = false) => {
        if (!this.groupsSolved.some(currentGroup => currentGroup.name === group.name)) {
            this.groupsSolved.push(group);
        }
        StorageManager.groupsSolved = this.groupsSolved;

        return this.UI.solveGroup(group, autocompleted);
    }


    
    /**
     * Find an item froms items.json by its id
     *
     * @param {number} id The id of the item
     * @returns {Object}
     */
    static findItemById(id) {
        return Constants.ITEMS.find(item => item.id === id);
    }

    autocomplete() {
        return new Promise((resolve) => {
            let remainingGroups = [];
    
            this.mapItemAndGroup.forEach((value, key) => {
                if (!this.groupsSolved.some(group => group.name === value.name) && !remainingGroups.includes(value)) {
                    remainingGroups.push(value);
                }
            });
    
            if (this.health !== 0) {
                this.attempts[this.currentAttempt] = [];
                for (let i = 0; i < 4; i++) {
                    this.attempts[this.currentAttempt][i] = remainingGroups[0];
                }
                this.currentAttempt++;
                StorageManager.attempts = this.attempts;
                StorageManager.currentAttempt = this.currentAttempt;
            }
    
            // Je trouve ça dégueulasse le JS...
            remainingGroups.reduce((promiseChain, group, index) => {
                let time = 1000; 
                return promiseChain.then(() => Utils.sleep(time).then(() => this.solveGroup(group, true)));
            }, Promise.resolve()).then(() => {
                this.UI.toggleToSolvedGroup();
                return Utils.sleep(1000);
            }).then(() => {
                resolve();
            });
        });
    }
    

    loose() {
        if (!StorageManager.finished)
        {
            StorageManager.winStreak = 0;
            StorageManager.longestStreak = Math.max(StorageManager.longestStreak, StorageManager.winStreak);
            StorageManager.losses++;
            StorageManager.finished = true;
        }

        this.UI.loose();
    }

    win() {
        if (!StorageManager.finished)
        {
            StorageManager.winStreak++;
            StorageManager.longestStreak = Math.max(StorageManager.longestStreak, StorageManager.winStreak);
            StorageManager.wins++;
            StorageManager.finished = true;
        }

        this.UI.win();        
    }
    
    getIndexOfGroup(group) {
        return this.groupsSelected.findIndex(currentGroup => currentGroup.name === group.name);
    }

    getIndexGroupFromItem(item) {
        return this.groupsSelected.findIndex(currentGroup => currentGroup.items.includes(item.id));
    }

    getItemsFromGroup(group) {
        return this.itemsSelected.filter(item => group.items.includes(item.id));
    }
}
