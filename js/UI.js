import { Constants } from "./Constants";

/**
 * @file UI.js
 * @description This file contains the UI class which is responsible for updating the UI of the game
 * @class UI
 * @typedef {UI}
 */
export class UI {
    constructor(game) {
        this.colors = ["red-300", "blue-300", "green-300", "yellow-300"];
        this.game = game;
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
        let difficulty = StorageManager.getItem('difficulty');
        const container = document.getElementById("cards-module");
        items.forEach((item, index) => {
            container.innerHTML += `
                <label class="card-module flex-col" data-id="${item.id}">
                    <input id="card-${index}" type="checkbox" class="visually-hidden">
                    <img src="/assets/gfx/items/collectibles/${numberWithLeadingZeros(item.id)}.png" alt="${item.alias}">
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
        document.querySelectorAll('button[data-id="shuffle"]').forEach(element => element.addEventListener('click', shuffleCards));
        document.querySelector('button[data-id="submit"]').addEventListener('click', game.handleSubmit);
    }

    /**
     * @description Shuffle the cards on the screen
     */
    shuffleCards() {
        const container = document.getElementById("cards-module");
        const labels = Array.from(document.querySelectorAll('.card-module'));
        container.innerHTML = '';
        shuffleArray(labels).forEach(label => container.appendChild(label));
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

    getSelectedItems() {
        return Array.from(document.querySelectorAll('.card-module--selected')).map(selected => parseInt(select.getAttribute('data-id')));
    }

    removeDifficulty() {
        let difficultyWrapper = document.querySelector('[data-id="difficulty"]');
        if (difficultyWrapper != null)
        {
            difficultyWrapper.classList.add('hidden');
        }
    }

    solveGroup(group) {
        const container = document.querySelector('.solved-groups');
        let index = this.game.groupAlreadyPicked.indexOf(group.name);
        let content =   `<section class="flex flex-row solved-group py-3 rounded-xl font-bold bg-${colors[index]}">
                            <div class="solved-group--cards flex flex-col mr-5">
                                <div class="flex flex-row">`;

        let i = 0;
        this.game.mapItemAndGroup.forEach((key, value) => {
            if (key === group) {
                const item = this.game.findItemById(value.id);
                if (i == 2) content += `</div><div class="flex flex-row">`;
                content += `<div class="solved-group--card"><img src="/assets/gfx/items/collectibles/${numberWithLeadingZeros(item.id)}.png" alt="${item.alias}"></div>`;
                document.querySelector(`label[data-id="${item.id}"]`).remove();
                i++;
            }
        });

        content += `</div></div>
            <div class="flex flex-1 flex-col items-start"><h3 class="solved-group--title text-lg md:text-xl">${group.name}</h3>
                <p class="solved-group--description text-xs md:text-lg">`;

        i = 0;
        this.game.mapItemAndGroup.forEach((key, value) => {
            if (key === group) {
                const item = this.game.findItemById(value.id);
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

    loose() {
        const modalPath = "/modals/loose.html";

        this.gameOver(modalPath);
        this.displayModal(modalPath);
    }

    win() {
        const modalPath = "/modals/win.html";

        this.gameOver(modalPath);
        this.displayModal(modalPath);
    }

    gameOver(modalPath) {
        const shufflesButton = document.querySelectorAll('button[data-id="shuffle"]');
        shufflesButton.forEach(button => button.remove());

        const buttons = document.querySelector('.buttons');
        buttons.innerHTML = '<button data-id="results" class="bg-purple-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">See results</button>';
        document.querySelector('button[data-id="results"]').addEventListener('click', () => displayModal(modalPath));
    }

    displayModal(modalPath) {
        const modalWrapper = document.getElementById('modal-wrapper');
        fetch(modalPath)
            .then(response => response.text())
            .then(content => {
                modalWrapper.innerHTML = content;
                document.querySelector('.close-button').addEventListener('click', () => {
                    modalWrapper.style.display = 'none';
                    modalWrapper.innerHTML = '';
                });
                document.querySelector('[data-id="results-wrapper"]').innerHTML = this.convertAttemptToSquareMatrix();
            })
            .catch(error => {
                console.error('Erreur lors du chargement du contenu de la modal:', error);
            });
    
            modalWrapper.style.display = 'flex';
    }

    convertAttemptToSquareMatrix() {
        const attempt = this.game.attempt;
        let content = `<div data-id="results" class="flex flex-col">`;
        attempt.forEach((group, index_attempt) => {
            content += `<div data-id="results-attempt${index_attempt}" class="flex justify-center items-center">`;
            group.forEach((item, index_group) => {
                const index = groupAlreadyPicked.indexOf(item);
                let rounded = index_group % 4 == 0 ? "rounded-l-lg" : index_group % 4 == 3 ? "rounded-r-lg" : "";
                content += `<span data-id="results-attempt${index_attempt}-item${index_group}-group${index}" class="bg-${colors[index]} ${rounded} w-10 h-10"></span>`;
            });
            content += `</div>`;
        });
        content += `</div>`;
        return content;
    }

}