"use strict";
import { Constants } from "./Constants.js";
import { DataFetcher } from "./DataFetcher.js";
import { StorageManager } from "./StorageManager.js";
import { UI } from "./UI.js";
import { Utils } from "./Utils.js";

class Game {
    constructor() {
        this.items = []; 
        this.groups = [];
        this.health = StorageManager.health;
        this.itemsAlreadyPicked = [];
        this.groupAlreadyPicked = [];
        this.groupsSolved = StorageManager.groupsSolved;
        this.attempts = StorageManager.attempts;
        this.currentAttempt = this.attempts.length;
        this.mapItemAndGroup = new Map();
        this.bannedGroup = [];
        this.bannedItem = [];
        this.UI = new UI(this);
        this.init();
    }

    async init() {
        const {items, groups} = await DataFetcher.fetchData();
        this.items = items;
        this.groups = groups;
        this.setupGame();
    }

    setupGame() {
        StorageManager.initDefaultLocalStorage();
        this.UI.updateHealth(this.health);

        for (let i = 0; i < Constants.NUMBER_OF_GROUPS; i++) {
            let currentGroup = this.getRandomGroup();
            this.getRandomItems(this.currentGroup);

            currentGroup.items.forEach(item => {
                if (bannedItem.indexOf(item) === -1) {
                    this.bannedItem.push(item);
                }

                this.groups.forEach(group => {
                    if (group.items.indexOf(item) !== -1) {
                        this.bannedGroup.push(group);
                    }
                });
            });
        }

        this.itemsAlreadyPicked = shuffleArray(this.itemsAlreadyPicked);
        this.UI.displayItems(this.itemsAlreadyPicked);
        this.UI.applyBorderRadius();
        this.UI.setupEventListeners();
        this.UI.addEventCheckboxes();

        const lastIsaaconnect = StorageManager.getItem('lastIsaaconnect');
        if (lastIsaaconnect !== Utils.getDaysSince()) {
            StorageManager.newIsaaconnect();
        } else {
            this.assignLocalStorageToVariables();
        }

        StorageManager.setItem('lastIsaaconnect', Utils.getDaysSince());
    }

    getRandomGroup() {
        let index, group, i = 0;

        do {
            index = Math.floor(Utils.getSeed(i++) * this.groups.length);
            group = this.groups[index];
        } while (this.groupAlreadyPicked.includes(group) || this.bannedGroup.includes(group));
    
        this.groupAlreadyPicked.push(group);
        return group;
    }

    
    /**
     * Pick NUMBER_OF_ITEMS items from the group
     *
     * @param {*} group
     * @returns {{}}
     */
    getRandomItems(group) {
        let items = [];
        let reset = false;
        for (let i = 0; i < Constants.NUMBER_OF_ITEMS; i++) {
            let indexGroup = Math.floor(Utils.getSeed(i) * group.items.length);
            let item = this.findItemById(group.items[indexGroup]), j = 1;

            while (this.itemsAlreadyPicked.includes(item) || this.bannedItem.includes(item.id)) {
                if (j >= group.items.length) {
                    this.groupAlreadyPicked.pop();
                    this.bannedGroup.push(group);
                    this.mapItemAndGroup.forEach((key, value) => {
                        if (key === group) this.mapItemAndGroup.delete(value);
                    });
                    this.itemsAlreadyPicked = this.itemsAlreadyPicked.filter(item => !group.items.includes(item.id));
                    group = this.getRandomGroup();
                    j = 1;
                    i = -1;
                    items = [];
                    reset = true;
                    break;
                }
                indexGroup = Math.floor(Utils.getSeed(j++) * group.items.length);
                item = this.findItemById(group.items[indexGroup]);
            }

            if (!reset) {
                items.push(item);
                this.itemsAlreadyPicked.push(item);
                this.mapItemAndGroup.set(item, group);
            }
            reset = false;
            if (items.length >= 4) break;
        }
    }

    
    /**
     * Assign the local storage values to the variables of the game
     */
    assignLocalStorageToVariables() {
        const localHealth = StorageManager.health;
        if (localHealth !== null) {
            this.health = parseInt(localHealth);
            this.UI.updateHealthDisplay(this.health);
        }

        const localGroupSolved = StorageManager.groupsSolved;
        if (localGroupSolved.length > 0) {
            this.groupsSolved = localGroupSolved;
            this.groupsSolved.forEach(groupName => {
                const group = this.groups.find(g => g.name === groupName);
                this.solveGroup(group);
                this.mapItemAndGroup.forEach((key, value) => {
                    if (groupName === key.name) this.mapItemAndGroup.delete(value);
                });
            });

            if (this.groupsSolved.length >= 3) this.gameOver();
        }

        const localAttempt = StorageManager.attempts;
        if (localAttempt.length > 0) {
            this.attempts = localAttempt;
            this.currentAttempt = this.attempts.length;
        }

        const theme = StorageManager.getItem('theme');
        document.body.classList.add(theme);

        const autocomplete = StorageManager.getItem('autocomplete', false);
        if (autocomplete) {
            StorageManager.setItem('autocomplete', true);
        } else {
            StorageManager.setItem('autocomplete', false);
        }
    }

    /**
     * Handle when the user click on the submit button.
     */
    handleSubmit() {
        const selectedItemsID = this.UI.getSelectedItems();
        let firstGroup, currentGroup, win = true, i = 0;

        this.attempts[currentAttempt] = [];
        let numberOfGroups = 0;
        selectedItemsID.forEach(id => {
            const currentItem = this.findItemById(id);
            const currentGroup = this.mapItemAndGroup.get(currentItem);

            if (!firstGroup) firstGroup = currentGroup;
            else if (firstGroup !== currentGroup) win = false;

            if (firstGroup === currentGroup) numberOfGroups++;

            this.attempts[currentAttempt].push(currentGroup.name);
        });

        this.currentAttempt++;
        
        if (numberOfGroups === 3) this.UI.showMessage("Almost...");

        if (win) {
            this.rightAnswer(firstGroup);
        } else {
            this.wrongAnswer(selectedItemsID);
        }

        this.UI.removeDifficulty();
        if (StorageManager.autocomplete && this.groupsSolved.length >= 3) this.autocomplete();

        
        if (this.health <= 0) this.loose();

        StorageManager.attempts = this.attempts;
        StorageManager.currentAttempt = this.currentAttempt;

        if (this.groupsSolved >= 4) this.win();
    }

    /**
     * 
     * @param {String} group The group's name to solve
     */
    rightAnswer(group) {
        this.solveGroup(group);
    }

    /**
     * Handle wrong answer
     * @param {Array} selectedItems The items selected by the user
     */
    wrongAnswer(selectedItems) {
        this.health--;
        this.UI.updateHealth(this.health);
        if (this.health <= 0) {
            this.loose();
        }

        this.UI.shakeItems(selectedItems);
    }

    solveGroup(group) {
        this.groupsSolved.push(group.name);
        this.UI.solveGroup(group);
        StorageManager.groupsSolved = this.groupsSolved;
    }

    
    /**
     * Find an item froms items.json by its id
     *
     * @param {number} id The id of the item
     * @returns {Object}
     */
    findItemById(id) {
        return this.items.find(item => item.id === id);
    }

    autocomplete() {
        this.groups.forEach(group => {
            if (this.groupsSolved.includes(group.name)) return;
            this.attempts[currentAttempt] = [];
            group.items.forEach(item => {
                this.attempts[currentAttempt].push(group.name);
            });
            this.solveGroup(group);
        });
    }

    loose() {
        this.UI.loose();

        StorageManager.winStreak = 0;
        StorageManager.longestStreak = Math.max(StorageManager.longestStreak, StorageManager.winStreak);
        StorageManager.looses++;
    }

    win() {
        this.UI.win();

        StorageManager.winStreak++;
        StorageManager.longestStreak = Math.max(StorageManager.longestStreak, StorageManager.winStreak);
        StorageManager.wins++;
    }


    // get groupAlreadyPicked() {
    //     return this.groupAlreadyPicked;
    // }

    // get mapItemAndGroup() {
    //     return this.mapItemAndGroup;
    // }

    // get attempt() {
    //     return this.attempts;
    // }

}

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
});
