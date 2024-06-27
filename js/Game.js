"use strict";
import { Constants } from "./Helpers/Constants.js";
import { DataFetcher } from "./Helpers/DataFetcher.js";
import { StorageManager } from "./Helpers/StorageManager.js";
import { UI } from "./UI.js";
import { Utils } from "./Helpers/Utils.js";


/**
 * @description The main class of the game
 *
 * @class Game
 * @typedef {Game}
 */
export class Game {
    
    constructor(debug = false) {
        Utils.resetIfNewVersion();
        this.debug = StorageManager.debug || debug;
        this.health = Constants.MAX_HEALTH;
        this.itemsSelected = [];
        this.groupsSelected = [];
        this.groupsSolved = [];
        this.attempts = [];
        this.history = [];
        this.currentAttempt = 0;
        this.mapItemAndGroup = new Map();
        this.UI = new UI(this, this.debug);
        this.init();
        StorageManager.version = Constants.VERSION;
    }
    
    /**
     * @description Initialize the game
     *
     * @async
     */
    async init() {
        const {items, groups} = await DataFetcher.fetchData();
        Constants.ITEMS = items;
        Constants.GROUPS = groups;
        this.setupGame();
    }

    
    /**
     * @description Setup the game
     */
    setupGame() {
        let tutorial = true;
        console.log(StorageManager.lastIsaaconnect);
        if (StorageManager.lastIsaaconnect === Constants.DEFAULT_DATA.lastIsaaconnect) tutorial = true;
        StorageManager.initDefaultLocalStorage();
        
        const lastIsaaconnect = StorageManager.lastIsaaconnect;
        if (lastIsaaconnect !== Utils.getDaysSince()) {
            StorageManager.newIsaaconnect();
        }
        
        this.UI.updateHealth(this.health);
        
        let bannedGroup = [];
        for (let i = 1; i <= Constants.NUMBER_OF_DAYS_BEFORE; i++) {
            const {selectedGroups, selectedItems} = Game.generateSelection(i);
            selectedGroups.forEach(group => {if (bannedGroup.indexOf(group) === -1) bannedGroup.push(group)});
        }
        
        const {selectedGroups, selectedItems} = Game.generateSelection(0, bannedGroup);
        this.groupsSelected = selectedGroups;
        this.itemsSelected = selectedItems;

        this.groupsSelected.forEach(group => {
            group.items.forEach(item => {
                this.itemsSelected.filter(currentItem => currentItem.id === item).length > 0 && this.mapItemAndGroup.set(Game.findItemById(item), group);
            });
        });

        StorageManager.mapItemAndGroup = this.mapItemAndGroup;

        this.itemsSelected = Utils.shuffleArray(this.itemsSelected);
        this.UI.displayItems(this.itemsSelected);
        this.UI.applyBorderRadius();
        this.UI.setupEventListeners();
        this.UI.addEventCheckboxes();

        this.assignLocalStorageToVariables();        

        StorageManager.lastIsaaconnect = Utils.getDaysSince();
        this.UI.addDebugMenu();
        this.UI.addTooltipListeners();
        if (tutorial) this.UI.showTutorial();
    }

    
    static generateSelection(daysBefore = 0, alreadyBanned = []) {
        let bannedGroup = alreadyBanned;
        let bannedItem = [];

        let selectedGroups = [];
        let selectedItems = [];


        for (let i = 0; i < Constants.NUMBER_OF_GROUPS; i++) {
            let currentGroup;
            currentGroup = Game.getRandomGroup(bannedGroup, daysBefore, true, i);
            selectedGroups.push(currentGroup);
            bannedGroup.push(currentGroup);

            let items = Game.getRandomItems(currentGroup, bannedItem, daysBefore);
            items.forEach(item => {
                selectedItems.push(item);
            });

            currentGroup.items.forEach(item => {
                if (bannedItem.indexOf(item) === -1) {
                    bannedItem.push(item);
                }

                Constants.GROUPS.forEach(group => {
                    if (group.items.indexOf(item) !== -1) {
                        bannedGroup.push(group);
                    }
                });
            });
        }

        return {selectedGroups, selectedItems};
    }

    /**
     * @description Get a random group from the groups array
     *
     * @static
     * @param {Array} groups The groups array
     * @param {Array} bannedGroup The groups that are already picked and banned
     * @param {number} [daysBefore=0] The number of days before the current date
     * @returns {Array} The group picked randomly
     */
    static getRandomGroup(bannedGroup, daysBefore = 0, filter = false, difficulty = 1, modifier = 0) {
        let index, group, i = 0;
        let groups = Constants.GROUPS;
        if (filter) groups = groups.filter(group => group.difficulty === difficulty);

        do {
            index = Math.floor(Utils.getSeed(i++ + modifier, daysBefore) * groups.length);
            group = groups[index];
        } while (bannedGroup.includes(group));
    
        return group;
    }

    
    /**
     * Pick NUMBER_OF_ITEMS items from the group
     *
     * @param {Array} group The group to pick the items from
     * @returns {{}}
     */
    static getRandomItems(group, bannedItem, daysBefore = 0) {
        let itemsPicked = [];
        let counter = 0;
        for (let i = 0; i < Constants.NUMBER_OF_ITEMS; i++) {
            let item;
            do {
                let indexGroup = Math.floor(Utils.getSeed(i + counter, daysBefore) * group.items.length);
                item = Game.findItemById(group.items[indexGroup]);
                counter++;
            } while (bannedItem.includes(item.id));

            if (counter >= 1000) {
                return null;
            }
            itemsPicked.push(item);
            bannedItem.push(item.id);
        }
        return itemsPicked;
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
        const selectedItemsID = this.UI.getSelectedItems();
        let numberOfGroups = 0;

        let j = 0;
        this.history.forEach((attempt, index) => {
            let k = 0;
            for (let i = 0; i < Constants.NUMBER_OF_ITEMS; i++) {
                const currentItem = Game.findItemById(selectedItemsID[i]);
                let isInclude = attempt.filter(item => item.id === currentItem.id).length > 0;
                if (isInclude) k++;
            }

            if (k === Constants.NUMBER_OF_ITEMS) j++;
        });

        const alreadyGuessed = j > 0 && this.currentAttempt !== 0;
        if (!alreadyGuessed) {
            let firstGroup, currentGroup, win = true;
            this.attempts[this.currentAttempt] = [];
            this.history[this.currentAttempt] = [];

            selectedItemsID.forEach(id => {
                const currentItem = Game.findItemById(id);
                currentGroup = this.mapItemAndGroup.get(currentItem);
                
                if (!firstGroup) firstGroup = currentGroup;
                else if (firstGroup !== currentGroup) win = false;

                if (firstGroup === currentGroup) numberOfGroups++;

                this.attempts[this.currentAttempt].push(currentGroup);
                this.history[this.currentAttempt].push(currentItem);
            });

            this.currentAttempt++;
            
            if (numberOfGroups === 3) this.UI.showMessage("Almost...");

            if (win) {
                this.rightAnswer(firstGroup);
            } else {
                this.wrongAnswer(selectedItemsID);
            }

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
        this.health--;
        StorageManager.health = this.health;
        this.UI.updateHealth(this.health);
        this.UI.shakeItems(selectedItems);

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


let theme = StorageManager.theme;
if (theme === null) theme = 'basement-theme';
if (theme === 'void-theme') {
    do {
        let randomValue = Constants.THEMES[Math.floor(Math.random() * Constants.THEMES.length)];
        theme = randomValue;
    } while (theme === 'void-theme');
}
document.querySelector('body').classList.add(theme);
  
const setVisible = (elementOrSelector, visible) => 
    (typeof elementOrSelector === 'string'
        ? document.querySelector(elementOrSelector)
        : elementOrSelector
    ).style.display = visible ? 'flex' : 'none';

setVisible('.page', false);
setVisible('.loader', true);

document.addEventListener('DOMContentLoaded', () =>
    Utils.sleep(1000).then(() => {
        setVisible('.page', true);
        setVisible('.loader', false);
        const game = new Game();
    })
);

