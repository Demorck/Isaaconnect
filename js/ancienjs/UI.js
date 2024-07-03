import { Constants } from "../Helpers/Constants.js";
import { StorageManager } from "../Helpers/Data/StorageManager.js";
import { Utils } from "../Helpers/Utils.js";
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
    
    removeDifficulty() {
        let difficultyWrapper = document.querySelector('[data-id="difficulty"]');
        if (difficultyWrapper != null)
        {
            difficultyWrapper.classList.add('hidden');
        }
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

    showTutorial() {
        let tutorialBackground = document.getElementById('tutorial-background');
        let game = document.getElementById('cards-game');
        tutorialBackground.classList.remove('hidden');
        
        let mobile = window.innerWidth < 768;

        let tutorial = document.getElementById('tutorial');
        tutorial.classList.remove('hidden');

        tutorial.classList.add('top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2');

        let tutorialsSteps = [firstStep, secondStep, thirdStep, correctGroup, wrongGroup];

        let nextButton = document.querySelector('[data-id="next"]');
        let skipButton = document.querySelector('[data-id="skip"]');
        addEvents();
        tutorialsSteps[0]();

        function firstStep() {
            let title = document.getElementById('title');
            let buttons = document.querySelector('.buttons');
            let shuffleMobile = document.querySelector('.shuffle-mobile');

            game.classList.add('-z-10');
            title.classList.add('-z-10');
            buttons.classList.add('-z-10');
            shuffleMobile.classList.add('-z-10');
        }

        function secondStep() {
            nextButton.classList.add('hidden');
            tutorial.style.transform = 'translate(-50%, 0%)';
            tutorial.classList.remove('top-1/2');

            tutorial.querySelector('p').innerHTML = "There are 4 groups to solve. Each group are 4 items with one thing in common. It can be an effect in the game, a shape on it, a transformation or completely a thing out of the game. You can click on the cards to select or deselect them. <br> Now, try to solve a group by clicking on 4 cards.";
            tutorial.querySelector('h1').innerHTML = "Solve the groups";
            let cards = document.querySelectorAll('.card-module input[type="checkbox"]');
            cards.forEach(card => {
                card.addEventListener('change', () => {
                    let selected = document.querySelectorAll('.card-module--selected');
                    if (selected.length == 4) {
                        nextButton.classList.remove('hidden');
                    } else {
                        nextButton.classList.add('hidden');
                    }
                });
            });

            game.classList.remove('-z-10');
            game.classList.add('z-40');
        }

        function thirdStep() {
            let buttons = document.querySelector('.buttons');
            tutorial.style.transform = 'translate(-50%, 0)';
            tutorial.classList.add(mobile ? 'bottom-4' : 'bottom-0');

            tutorial.querySelector('p').innerHTML = "When you are ready, click on the submit button ! Be careful, you have only 4 lives.";
            tutorial.querySelector('h1').innerHTML = "Moment of truth";

            nextButton.classList.add('hidden');
            let submitButton = document.querySelector('button[data-id="submit"]');
            submitButton.classList.remove('button--disabled');
            submitButton.disabled = false;
            submitButton.addEventListener('click', () => {
                let solved = StorageManager.groupsSolved;
                tutorial.classList.remove('bottom-0');
                tutorial.classList.remove('bottom-4');
                if (solved.length >= 1) {
                    shiftingSteps();
                } else {
                    shiftingSteps(2);
                }
            });

            buttons.classList.remove('-z-10');
            buttons.classList.add('z-40');
        }

        function correctGroup() {
            let buttons = document.querySelector('.buttons');
            tutorial.classList.add('top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2');
            tutorial.style.transform = 'translate(-50%, -50%)';

            tutorial.querySelector('h1').innerHTML = "Congratulations!";
            tutorial.querySelector('p').innerHTML = "Congratulations! You solved your first group. You can click on the items to see more information on the wiki ! Have fun !";
        
            nextButton.remove();
            skipButton.innerHTML = "Close tutorial";

            game.classList.remove("z-40");
            game.classList.add("-z-10");
            buttons.classList.remove("z-40");
            buttons.classList.add("-z-10");
        }

        function wrongGroup() {
            let buttons = document.querySelector('.buttons');
            tutorial.classList.add('top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2');
            tutorial.style.transform = 'translate(-50%, -50%)';

            tutorial.querySelector('h1').innerHTML = "Oh no! Anyway...";
            tutorial.querySelector('p').innerHTML = "You lost a life. You can try again to solve the group. You can't guess the same group twice. If you guess a group, you can click on items to see more information on the wiki. Have fun !";
        
            nextButton.remove();
            skipButton.innerHTML = "Close tutorial";

            game.classList.remove("z-40");
            game.classList.add("-z-10");
            buttons.classList.remove("z-40");
            buttons.classList.add("-z-10");
        }

        function addEvents() {
            nextButton.addEventListener('click', () => {
                shiftingSteps();
            });

            let skipButton = document.querySelector('[data-id="skip"]');
            skipButton.addEventListener('click', removeTutorial);
        }

        function shiftingSteps(shift = 1) {
            for (let i = 0; i < shift; i++) {
                tutorialsSteps.shift();
            }
            if (tutorialsSteps.length == 0) {
                removeTutorial();
            }
            else {
                tutorialsSteps[0]();
            }
        }

        function removeTutorial() {
            tutorialBackground.classList.add('hidden');
            tutorial.classList.add('hidden');
            game.classList.remove('-z-10');
        }
    }

}

