"use strict";
import { Constants } from "./Helpers/Constants.js";
import { DataFetcher } from "./DataFetcher.js";
import { StorageManager } from "./Helpers/StorageManager.js";
import { UI } from "./UI.js";
import { Utils } from "./Helpers/Utils.js";

class Game {
    constructor(debug = false) {
        Utils.resetIfNewVersion();
        this.debug = StorageManager.debug || debug;
        this.items = []; 
        this.groups = [];
        this.health = Constants.MAX_HEALTH;
        this.itemsAlreadyPicked = [];
        this.groupAlreadyPicked = [];
        this.groupsSolved = [];
        this.attempts = [];
        this.currentAttempt = 0;
        this.mapItemAndGroup = new Map();
        this.bannedGroup = [];
        this.bannedItem = [];
        this.UI = new UI(this, this.debug);
        this.init();
        StorageManager.version = Constants.VERSION;
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
            this.getRandomItems(currentGroup);

            currentGroup.items.forEach(item => {
                if (this.bannedItem.indexOf(item) === -1) {
                    this.bannedItem.push(item);
                }

                this.groups.forEach(group => {
                    if (group.items.indexOf(item) !== -1) {
                        this.bannedGroup.push(group);
                    }
                });
            });
        }

        StorageManager.mapItemAndGroup = this.mapItemAndGroup;

        this.itemsAlreadyPicked = Utils.shuffleArray(this.itemsAlreadyPicked);
        this.UI.displayItems(this.itemsAlreadyPicked);
        this.UI.applyBorderRadius();
        this.UI.setupEventListeners();
        this.UI.addEventCheckboxes();

        const lastIsaaconnect = StorageManager.lastIsaaconnect;
        if (lastIsaaconnect !== Utils.getDaysSince()) {
            StorageManager.newIsaaconnect();
            console.log("New isaaconnect");
        } else {
            this.assignLocalStorageToVariables();
        }

        StorageManager.lastIsaaconnect = Utils.getDaysSince();
        this.UI.addDebugMenu();
        this.UI.addTooltipListeners();
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
                console.log(this.health);
                if (this.health > 0) this.win();
                else this.loose();
            }
        }

        const localAttempt = StorageManager.attempts;
        if (localAttempt.length > 0) {
            this.attempts = localAttempt;
            this.currentAttempt = this.attempts.length;
        }
    }

    /**
     * Handle when the user click on the submit button.
     */
    handleSubmit = () => {
        const selectedItemsID = this.UI.getSelectedItems();
        let firstGroup, currentGroup, win = true, i = 0;

        this.attempts[this.currentAttempt] = [];
        let numberOfGroups = 0;
        selectedItemsID.forEach(id => {
            const currentItem = this.findItemById(id);
            currentGroup = this.mapItemAndGroup.get(currentItem);

            if (!firstGroup) firstGroup = currentGroup;
            else if (firstGroup !== currentGroup) win = false;

            if (firstGroup === currentGroup) numberOfGroups++;

            this.attempts[this.currentAttempt].push(currentGroup);
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

        StorageManager.attempts = this.attempts;
        StorageManager.currentAttempt = this.currentAttempt;
        
        if (this.health <= 0) this.loose();
        else if (this.groupsSolved.length >= 4) this.win();
    }

    /**
     * 
     * @param {String} group The group's name to solve
     */
    rightAnswer = (group) => {
        this.solveGroup(group);
        StorageManager.groupsSolved = this.groupsSolved;
        if (this.groupsSolved.length >= 4) this.win();
    }

    /**
     * Handle wrong answer
     * @param {Array} selectedItems The items selected by the user
     */
    wrongAnswer = (selectedItems) => {
        this.health--;
        StorageManager.health = this.health;
        this.UI.updateHealth(this.health);
        this.UI.shakeItems(selectedItems);

        if (this.health <= 0) {
            this.autocomplete();
            this.loose();
        }
    }

    solveGroup = (group) => {
        this.groupsSolved.filter(currentGroup => currentGroup.name === group.name).length === 0 && this.groupsSolved.push(group);
        this.UI.solveGroup(group);
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
        let groupToFind = []
        this.mapItemAndGroup.forEach((key, value) => {
            this.groupsSolved.filter(group => group.name === key.name).length === 0 && (groupToFind.indexOf(key) === -1) && groupToFind.push(key);
        });

        if (this.health != 0)
        {
            this.attempts[this.currentAttempt] = [];
            for (let i = 0; i < 4; i++) {
                this.attempts[this.currentAttempt][i] = groupToFind[0];
            }
            this.currentAttempt++;
            StorageManager.attempts = this.attempts;
            StorageManager.currentAttempt = this.currentAttempt;
        }
        
        groupToFind.forEach(group => { this.solveGroup(group); });
        StorageManager.groupsSolved = this.groupsSolved;
    }

    loose() {
        if (!StorageManager.finished)
        {
            StorageManager.winStreak = 0;
            StorageManager.longestStreak = Math.max(StorageManager.longestStreak, StorageManager.winStreak);
            StorageManager.looses++;
        }

        this.UI.loose();
    }

    win() {
        if (!StorageManager.finished)
        {
            StorageManager.winStreak++;
            StorageManager.longestStreak = Math.max(StorageManager.longestStreak, StorageManager.winStreak);
            StorageManager.wins++;
        }

        this.UI.win();        
    }

    getIndexOfGroup(group) {
        return this.groupAlreadyPicked.findIndex(currentGroup => currentGroup.name === group.name);
    }

    getIndexGroupFromItem(item) {
        return this.groupAlreadyPicked.findIndex(currentGroup => currentGroup.items.includes(item.id));
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
});