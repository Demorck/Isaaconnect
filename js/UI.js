import { Constants } from "./Helpers/Constants.js";
import { StorageManager } from "./Helpers/StorageManager.js";
import { Utils } from "./Helpers/Utils.js";
import { initializeTooltipListener } from "./Tooltips/Tooltips.js";
import { Game } from "./Game.js";

/**
 * @file UI.js
 * @description This file contains the UI class which is responsible for updating the UI of the game
 * @class UI
 * @typedef {UI}
 */
export class UI {
    constructor(game, debug = false) {
        this.game = game;
        this.debug = debug;
    }

    /**
     * @description Display and updates hearts on the screen
     *
     * @param {number} health The health of the player
     */
    updateHealth(health) {
        const container = document.querySelector('.hearts');
        container.innerHTML = '';
        for (let i = 0; i < health; i++) {
            container.innerHTML += `<img src="/assets/gfx/heart.png" alt="heart" data-type="health">`;
        }
        for (let i = health; i < Constants.MAX_HEALTH; i++) {
            container.innerHTML += `<img src="/assets/gfx/empty heart.png" alt="empty heart" data-type="empty">`;
        }
    }

    
    /**
     * @description Display and create cards on the screen
     *
     * @param {Array} items
     */
    displayItems(items) {
        let difficulty = StorageManager.difficulty;
        const container = document.getElementById("cards-module");
        items.forEach((item, index) => {
            container.innerHTML += `
                <label class="card-module flex-col" data-id="${item.id}">
                    <input id="card-${index}" type="checkbox" class="visually-hidden">
                    <img src="/assets/gfx/items/collectibles/${Utils.numberWithLeadingZeros(item.id)}.png" alt="${item.alias}">
                    <span class="card-module--content text-xs sm:text-sm ${difficulty == "normal" ? "hidden" : ""}">${item.alias}</span>
                </label>
            `;
        });
    }

    /**
     * @description Apply border radius to the cards.
     */
    applyBorderRadius() {
        const labels = document.querySelectorAll('.card-module');
        labels.forEach((label, index) => {
            label.classList.remove('rounded-tl-3xl', 'rounded-tr-3xl', 'rounded-bl-3xl', 'rounded-br-3xl');
            if (index === 0) label.classList.add('rounded-tl-3xl');
            if (index === 3) label.classList.add('rounded-tr-3xl');
            if (index === labels.length - 4) label.classList.add('rounded-bl-3xl');
            if (index === labels.length - 1) label.classList.add('rounded-br-3xl');
        });

        const solved = document.querySelectorAll('.solved-group');
        solved.forEach((group, index) => {
            group.classList.remove('rounded-tl-3xl', 'rounded-tr-3xl', 'rounded-bl-3xl', 'rounded-br-3xl');
            if (index === 0)
                group.classList.add('rounded-tl-3xl', 'rounded-tr-3xl');

            if (index === solved.length - 1)
                group.classList.add('rounded-bl-3xl', 'rounded-br-3xl');
        });
    }

    
    /**
     * Shows a message in the middle of the screen for 3 seconds.
     *
     * @param {String} message The message to be displayed
     */
    showMessage(message) {
        const container = document.querySelector('.message');
        container.innerHTML = message;
        container.classList.toggle('hidden');
        setTimeout(() => {
            container.innerHTML = '';
            container.classList.toggle('hidden');
        }, 3000);
    }

    /**
     * @description Setup event listeners for the cards
     */
    setupEventListeners() {
        document.querySelectorAll('button[data-id="shuffle"]').forEach(element => element.addEventListener('click', this.shuffleCards));
        document.querySelector('button[data-id="submit"]').addEventListener('click', this.game.handleSubmit);
    }

    /**
     * @description Shuffle the cards on the screen
     */
    shuffleCards = () => {
        const container = document.getElementById("cards-module");
        const labels = Array.from(document.querySelectorAll('.card-module'));
        container.innerHTML = '';
        Utils.shuffleArray(labels).forEach(label => container.appendChild(label));
        this.applyBorderRadius();
    }

    deselectAllCards() {
        document.querySelectorAll('.card-module').forEach(label => {
            label.classList.remove('card-module--selected', 'card-module--disabled');
            label.querySelector('input[type="checkbox"]').disabled = false;
        });
    
        document.querySelector('button[data-id="submit"]').classList.add('button--disabled');
        document.querySelector('button[data-id="submit"]').disabled = true;
    }

    addEventCheckboxes() {
        const checkboxes = document.querySelectorAll('.card-module input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                let numberOfSelected = document.querySelectorAll('.card-module--selected').length;
                if (numberOfSelected <= 4) {
                    checkbox.parentNode.classList.toggle('card-module--selected');
                }
        
                numberOfSelected = document.querySelectorAll('.card-module--selected').length;
                if (numberOfSelected == 4) {
                    checkboxes.forEach(otherCheckboxes => {
                        if (!otherCheckboxes.parentNode.classList.contains('card-module--selected')) {
                            otherCheckboxes.parentNode.classList.add('card-module--disabled');
                            otherCheckboxes.disabled = true;
                        }
                    });

                    
                    document.querySelector('button[data-id="submit"]').classList.remove('button--disabled');
                    document.querySelector('button[data-id="submit"]').disabled = false;
                }
                else {
                    checkboxes.forEach(otherCheckboxes => {
                        otherCheckboxes.parentNode.classList.remove('card-module--disabled');
                        otherCheckboxes.disabled = false;
                    });
                    
                    document.querySelector('button[data-id="submit"]').classList.add('button--disabled');
                    document.querySelector('button[data-id="submit"]').disabled = true;
                }
            });
        });
    }

    getSelectedItems = () => {
        return Array.from(document.querySelectorAll('.card-module--selected')).map(selected => parseInt(selected.getAttribute('data-id')));
    }

    removeDifficulty() {
        let difficultyWrapper = document.querySelector('[data-id="difficulty"]');
        if (difficultyWrapper != null)
        {
            difficultyWrapper.classList.add('hidden');
        }
    }

    solveGroup = (group) => {
        const container = document.querySelector('.solved-groups');
        let index = this.game.getIndexOfGroup(group);
        let content =   `<section class="flex flex-row solved-group py-3 rounded-xl font-bold bg-${Constants.COLORS[index]}">
                            <div class="solved-group--cards flex flex-col mr-5">
                                <div class="flex flex-row">`;

        let i = 0;
        this.game.mapItemAndGroup.forEach((key, value) => {
            if (key.name === group.name) {
                const item = Game.findItemById(value.id);
                if (i == 2) content += `</div><div class="flex flex-row">`;
                content += `<div class="solved-group--card"><img src="/assets/gfx/items/collectibles/${Utils.numberWithLeadingZeros(item.id)}.png" alt="${item.alias}"></div>`;
                document.querySelector(`label[data-id="${item.id}"]`).remove();
                i++;
            }
        });

        content += `</div></div>
            <div class="flex flex-1 flex-col items-start"><h3 class="solved-group--title text-lg md:text-xl">${group.name}</h3>
                <p class="solved-group--description text-xs md:text-lg">`;

        i = 0;
        this.game.mapItemAndGroup.forEach((key, value) => {
            if (key.name === group.name) {
                const item = Game.findItemById(value.id);
                content += `${item.alias}`;
                if (i != 3) content += `, `;
                i++;
            }
        });

        content += `</p></div>`;

        content += `</div></section>`;
        container.innerHTML += content;
        
        this.deselectAllCards();
        this.applyBorderRadius();
    }

    async loose() {
        const modalPath = "/include/modals/lose.html";
        let html = await Utils.loadHtml(modalPath);
        let placeholders = {};
        let attempts = StorageManager.attempts;
        let groupsFound = 0; 
        attempts.forEach(attempt => {
            let firstGroup;
            let found = true;
            attempt.forEach(group => {
                if (firstGroup === undefined) {
                    firstGroup = group;
                } else {
                    if (firstGroup.name !== group.name) {
                        found = false;
                    }
                }
            });
            if (found) {
                groupsFound++;
            }
        });
        placeholders.groups = groupsFound;
        placeholders.losses = StorageManager.losses;
        html = Utils.replacePlaceholders(html, placeholders);

        this.gameOver(html);
        this.displayModal(html);
    }

    async win() {
        const modalPath = "/include/modals/win.html";
        let html = await Utils.loadHtml(modalPath);
        let placeholders = {};
        placeholders.mistakes = Constants.MAX_HEALTH - StorageManager.health;
        placeholders.streak = StorageManager.winStreak;
        html = Utils.replacePlaceholders(html, placeholders);

        this.gameOver(html);
        this.displayModal(html);
    }

    gameOver(html) {
        if (!StorageManager.finished)
            StorageManager.finished = true;
        
        const shufflesButton = document.querySelectorAll('button[data-id="shuffle"]');
        shufflesButton.forEach(button => button.remove());

        const buttons = document.querySelector('.buttons');
        buttons.innerHTML = '<button data-id="results" class="bg-purple-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">See results</button>';
        document.querySelector('button[data-id="results"]').addEventListener('click', () => this.displayModal(html));
        document.querySelector('#cards-game').classList.remove('h-min', 'md:w-min', 'md:h-min');
    }

    displayModal = (html) => {
        const modalWrapper = document.getElementById('modal-wrapper');
        modalWrapper.innerHTML = html;
        document.querySelector('.close-button').addEventListener('click', () => {
            modalWrapper.style.display = 'none';
            modalWrapper.innerHTML = '';
        });
        document.querySelector('[data-id="results-wrapper"]').innerHTML = this.convertAttemptToSquareMatrix();

        let copyButton = document.getElementById('copy');
        copyButton.addEventListener('click', () => this.copyResults(copyButton));
            
        modalWrapper.style.display = 'flex';
    }

    convertAttemptToSquareMatrix() {
        const attempt = this.game.attempts;
        let content = `<div data-id="results" class="flex flex-col">`;
        attempt.forEach((group, index_attempt) => {
            content += `<div data-id="results-attempt${index_attempt}" class="flex justify-center items-center">`;
            group.forEach((currentGroup, index_group) => {
                const index = this.game.getIndexOfGroup(currentGroup);
                let rounded = index_group % 4 == 0 ? "rounded-l-lg" : index_group % 4 == 3 ? "rounded-r-lg" : "";
                content += `<span data-id="results-attempt${index_attempt}-item${index_group}-group${index}" class="bg-${Constants.COLORS[index]} ${rounded} w-10 h-10"></span>`;
            });
            content += `</div>`;
        });
        content += `</div>`;
        return content;
    }

    shakeItems = () => {
        const items = document.querySelectorAll('.card-module--selected');
        items.forEach(item => item.classList.add('card-module--shake'));
        setTimeout(() => {
            document.querySelectorAll('.card-module--shake').forEach(item => item.classList.remove('card-module--shake'));
        }, 1000);
    }

    addDebugMenu() {
        if (this.debug) {
            document.getElementById('tooltip-icons').innerHTML += `<span class="material-symbols-rounded md:text-4xl"  data-id="debug">
                    adb
                </span>`;
        }
    }

    addTooltipListeners() {
        initializeTooltipListener();
    }

    copyResults(element) {
        let title = "Isaaconnect #" + StorageManager.lastIsaaconnect;
        try
        {
            let textToCopy = "";
            textToCopy = title + "\n";

            let health = StorageManager.health;
            
            if (typeof health != "number")
            {
                this.showMessage("Impossible to copy the results");
                return;
            }

            textToCopy += `❤️: ${health} 💔: ${Constants.MAX_HEALTH - health}\n`;
            let attempts = StorageManager.attempts;

            attempts.forEach((attempt, index) => {
                attempt.forEach((group, index_group) => {
                    let index = this.game.getIndexOfGroup(group);
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
                    }
                });
                textToCopy += "\n";
            });

            navigator.clipboard.writeText(textToCopy);
            element.innerHTML = `<span class="material-symbols-outlined align-bottom">check</span>Copied!`;
            this.showMessage("Results copied to clipboard");
        }
        catch (error)
        {
            this.showMessage("Impossible to copy the results");
        }
    }

}

