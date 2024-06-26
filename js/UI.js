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

        let windowWidth = window.innerWidth;
        if (windowWidth >= 768) {
            let square = document.getElementById('cards-game');
            let height = square.offsetWidth;
            new ResizeObserver(() => {
                let firstSolve = document.querySelector('.solved-group');
                let lastSolver = document.querySelectorAll('.solved-group')[3];
                console.log(firstSolve, lastSolver);
                if (firstSolve != null && lastSolver != null) {
                    height = lastSolver.getBoundingClientRect().bottom - firstSolve.getBoundingClientRect().top;
                    if (height > 550) {
                        height = Math.ceil(height);
                    }
                }

                square.style.height = `${height}px`;
            }).observe(square);
        }
    }

    /**
     * @description Display and updates hearts on the screen
     *
     * @param {number} health The health of the player
     */
    updateHealth(health) {
        let container = document.querySelector('.hearts');
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
        let container = document.getElementById("cards-module");
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
        let labels = document.querySelectorAll('.card-module');
        labels.forEach((label, index) => {
            label.classList.remove('rounded-tl-3xl', 'rounded-tr-3xl', 'rounded-bl-3xl', 'rounded-br-3xl');
            if (index === 0) label.classList.add('rounded-tl-3xl');
            if (index === 3) label.classList.add('rounded-tr-3xl');
            if (index === labels.length - 4) label.classList.add('rounded-bl-3xl');
            if (index === labels.length - 1) label.classList.add('rounded-br-3xl');
        });

        let solved = document.querySelectorAll('.solved-group');
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
        let container = document.querySelector('.message');
        container.innerHTML = message;
        container.classList.remove('hidden');
        setTimeout(() => {
            container.innerHTML = '';
            container.classList.add('hidden');
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
        let container = document.getElementById("cards-module");
        let labels = Array.from(document.querySelectorAll('.card-module'));
        container.innerHTML = '';
        Utils.shuffleArray(labels).forEach(label => container.appendChild(label));
        this.applyBorderRadius();
    }

    deselectAllCards() {
        document.querySelectorAll('.card-module').forEach(label => {
            label.classList.remove('card-module--selected', 'card-module--disabled');
            label.querySelector('input[type="checkbox"]').disabled = false;
        });
    
        let submitButton = document.querySelector('button[data-id="submit"]');
        if (submitButton != null) {
            submitButton.classList.add('button--disabled');
            submitButton.disabled = true;
        }
    }

    addEventCheckboxes() {
        let checkboxes = document.querySelectorAll('.card-module input[type="checkbox"]');
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

    solveGroup = (group, autocomplete = false) => {
        let container = document.querySelector('#cards-win');
        container.classList.remove('hidden');
        let index = this.game.getIndexOfGroup(group);
        let wrapper = document.getElementById('cards-module');
        let time = 0;
        let indexContains = [];
        let numberAlreadySelected = 0;

        if (autocomplete) {
            this.removeButtons();
            let itemsFromGroup = this.game.getItemsFromGroup(group);
            itemsFromGroup.forEach(item => {
                let label = document.querySelector(`label[data-id="${item.id}"]`);
                label.querySelector('input[type="checkbox"]').checked = true;
                label.classList.add('card-module--selected');
            });
        }

        let selected = document.querySelectorAll('.card-module--selected');

        if (selected.length == Constants.NUMBER_OF_ITEMS && wrapper.children.length != Constants.NUMBER_OF_ITEMS) {
            for (let i = 0; i < Constants.NUMBER_OF_ITEMS; i++) {
                let isNotSelected = !wrapper.children[i].classList.contains('card-module--selected');
                if(isNotSelected) {
                    indexContains.push(i);
                }
            }

            numberAlreadySelected = Constants.NUMBER_OF_ITEMS - indexContains.length;

            for (let i = 0; i < indexContains.length; i++) {
                this.swapUI(selected[numberAlreadySelected + i], wrapper.children[indexContains[i]]);
            }

            time = 700;
        }

        Utils.sleep(time).then(() => {
            let content =   `<section class="flex flex-1 flex-row solved-group py-3 rounded-xl bg-${Constants.COLORS[index]}">
                                <div class="solved-group--cards flex flex-col mr-5">
                                    <div class="flex flex-row">`;

            let i = 0;
            this.game.mapItemAndGroup.forEach((key, value) => {
                if (key.name === group.name) {
                    let item = Game.findItemById(value.id);
                    if (i == 2) content += `</div><div class="flex flex-row">`;
                    content += `<div class="solved-group--card"><a target="_blank"  href="${Constants.WIKI + item.alias}"><img src="/assets/gfx/items/collectibles/${Utils.numberWithLeadingZeros(item.id)}.png" alt="${item.alias}"></a></div>`;
                    document.querySelector(`label[data-id="${item.id}"]`).remove();
                    i++;
                }
            });

            content += `</div></div>
                <div class="flex flex-1 flex-col items-start text-left"><h3 class="solved-group--title font-bold text-xs md:text-xl mb-2">${group.name}</h3>
                    <p class="solved-group--description text-[0.65rem] font-medium md:text-sm">`;

            i = 0;
            this.game.mapItemAndGroup.forEach((key, value) => {
                if (key.name === group.name) {
                    let item = Game.findItemById(value.id);
                    content += `<a target="_blank"  href="${Constants.WIKI + item.alias}">${item.alias}</a>`;
                    if (i != 3) content += `, `;
                    i++;
                }
            });

            content += `</p></div>`;

            content += `</div></section>`;
            container.innerHTML += content;
            
            this.deselectAllCards();
            this.applyBorderRadius();
        });
    }

    async loose() {
        let modalPath = "/include/modals/lose.html";
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
        let modalPath = "/include/modals/win.html";
        let html = await Utils.loadHtml(modalPath);
        let placeholders = {};
        placeholders.mistakes = Constants.MAX_HEALTH - StorageManager.health;
        placeholders.streak = StorageManager.winStreak;
        switch (placeholders.mistakes) {
            case 0:
                placeholders.title = "!!! DEAD GOD !!!"
                break;
            case 1:
                placeholders.title = "!! PLATINUM GOD !!"
                break;

            case 2:
                placeholders.title = "! GOLDEN GOD !"
                break;

            case 3:
                placeholders.title = "Incredible, you did it!"
                break;
        }
        html = Utils.replacePlaceholders(html, placeholders);

        this.gameOver(html);
        this.displayModal(html);
    }

    gameOver(html) {
        if (!StorageManager.finished)
            StorageManager.finished = true;

        document.getElementById('cards-module').remove();
        this.removeButtons();
        let buttonResults = document.querySelector('button[data-id="results"]');
        buttonResults.classList.remove('button--disabled');
        buttonResults.addEventListener('click', () => this.displayModal(html));
        this.toggleToSolvedGroup();
    }

    displayModal = (html) => {
        let modalWrapper = document.getElementById('modal-wrapper');
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
        let attempt = this.game.attempts;
        let content = `<div data-id="results" class="flex flex-col">`;
        attempt.forEach((group, index_attempt) => {
            content += `<div data-id="results-attempt${index_attempt}" class="flex justify-center items-center">`;
            group.forEach((currentGroup, index_group) => {
                let index = this.game.getIndexOfGroup(currentGroup);
                let rounded = index_group % 4 == 0 ? "rounded-l-lg" : index_group % 4 == 3 ? "rounded-r-lg" : "";
                content += `<span data-id="results-attempt${index_attempt}-item${index_group}-group${index}" class="bg-${Constants.COLORS[index]} ${rounded} w-10 h-10"></span>`;
            });
            content += `</div>`;
        });
        content += `</div>`;
        return content;
    }

    shakeItems = () => {
        let items = document.querySelectorAll('.card-module--selected');
        items.forEach(item => item.classList.add('card-module--shake'));
        setTimeout(() => {
            document.querySelectorAll('.card-module--shake').forEach(item => item.classList.remove('card-module--shake'));
        }, 1000);
    }

    removeButtons() {
        let shufflesButton = document.querySelectorAll('button[data-id="shuffle"]');
        shufflesButton.forEach(button => button.remove());

        let buttons = document.querySelector('.buttons');
        buttons.innerHTML = '<button data-id="results" class="button--submit font-bold py-2 px-4 rounded button--disabled">See results</button>';
    }

    animation = () => {
        let selected = document.querySelectorAll('.card-module--selected');
        let first = selected[0];
        let last = selected[selected.length - 1];

        this.swapUI(first, last);
    }

    swap(node1, node2) {
        let afterNode2 = node2.nextElementSibling;
        let parent = node2.parentNode;
        node1.replaceWith(node2);
        parent.insertBefore(node1, afterNode2);
    }

    swapUI = (Element1, Element2) => {
        let finalElement1Style = {
            x: null,
            y: null,
        };
        let finalElement2Style = {
            x: null,
            y: null,
        };

        let element1 = {
            x: Element1.getBoundingClientRect().left,
            y: Element1.getBoundingClientRect().top,
        };
        let element2 = {
            x: Element2.getBoundingClientRect().left,
            y: Element2.getBoundingClientRect().top,
        };
           
        Element1.classList.add('transition');
        Element2.classList.add('transition');

        finalElement1Style.x = element2.x - element1.x;
        finalElement2Style.x = element1.x - element2.x;
        finalElement1Style.y = element2.y - element1.y;
        finalElement2Style.y = element1.y - element2.y;

        Element1.style.transform = `translate(${finalElement1Style.x}px, ${finalElement1Style.y}px)`;
        Element2.style.transform = `translate(${finalElement2Style.x}px, ${finalElement2Style.y}px)`;
    
        setTimeout(() => {
            this.swap(Element1, Element2);
            this.applyBorderRadius();
            Element1.classList.remove('transition');
            Element2.classList.remove('transition');
            Element2.removeAttribute('style');
            Element1.removeAttribute('style');
        }, 500);
    }

    sameElement = (element1, element2) => {
        return element1.dataset.id === element2.dataset.id;
    }

    addDebugMenu() {
        if (this.debug) {
            document.getElementById('tooltip-icons').innerHTML += `<span class="material-symbols-rounded md:text-4xl"  data-id="debug">
                    adb
                </span>`;
        }
    }

    toggleToSolvedGroup() {
        document.querySelector('#cards-game').classList.remove('h-min', 'md:w-min', 'md:h-min');
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

            if (StorageManager.link)
            {
                textToCopy += Constants.URL;
            }

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

