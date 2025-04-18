import { StorageManager } from "@/Shared/Helpers/Data/StorageManager";
import { Utils } from "@/Shared/Helpers/Utils";
import {MainGame} from "@/MainGame/Models/MainGame";
import {MainGameController} from "@/MainGame/Controllers/MainGameController";

class Tutorial {
    private tutorialBackground: HTMLElement;
    private game: HTMLElement;
    private tutorial: HTMLElement;
    private nextButton!: HTMLElement;
    private skipButton!: HTMLElement;
    private tooltips!: HTMLElement;
    private tutorialsSteps!: Array<() => void>;
    private mobile!: boolean;
    private skipTutorial: boolean;
    private game_: MainGameController;

    constructor(game_: MainGameController) {
        this.game_ = game_;
        this.skipTutorial = false;
        this.tutorialBackground = document.getElementById('bigmodal-background')!;
        this.game = document.getElementById('cards-game')!;
        this.tutorial = document.getElementById('bigmodal-wrapper')!;
        this.loadTutorial().then(() => {
            this.nextButton = document.querySelector('[data-id="next"]')!;
            this.skipButton = document.querySelector('[data-id="skip"]')!;
            this.tooltips = document.querySelector('#tooltips')!;
            this.mobile = window.innerWidth < 768;
            this.tutorialsSteps = [this.firstStep.bind(this), this.secondStep.bind(this), this.thirdStep.bind(this), this.correctGroup.bind(this), this.wrongGroup.bind(this)];
            this.addEvents();
            this.showTutorial();
        });
    }

    private async loadTutorial(): Promise<void> {
        let tutorial = await Utils.loadHTML('/include/modals/tutorial.html');
        this.tutorial.innerHTML = tutorial;
    }

    private showTutorial() {
        this.tutorialBackground.classList.remove('hidden');
        this.tutorial.classList.remove('hidden');
        this.tutorial.classList.add('top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2');
        this.tutorialsSteps[0]();
    }

    private firstStep() {
        let title = document.getElementById('title')!;
        let buttons = document.querySelector('.buttons')!;
        let shuffleMobile = document.querySelector('.shuffle-mobile')!;

        this.game.classList.add('-z-10');
        this.tooltips.classList.add('-z-10');
        title.classList.add('-z-10');
        buttons.classList.add('-z-10');
        shuffleMobile.classList.add('-z-10');
    }

    private secondStep() {
        this.nextButton.classList.add('hidden');
        this.tutorial.style.transform = 'translate(-50%, 0%)';
        this.tutorial.classList.remove('top-1/2');

        this.tutorial.querySelector('p')!.innerHTML = "There are 4 groups to solve. Each group are 4 items with one thing in common. You can click on the cards to select or deselect them. <br> Now, try to solve a group by clicking on 4 cards.";
        this.tutorial.querySelector('h1')!.innerHTML = "Solve the groups";
        let cards = document.querySelectorAll('.card-module input[type="checkbox"]');
        cards.forEach(card => {
            card.addEventListener('change', this.hiddenNextButton.bind(this));
        });

        this.game.classList.remove('-z-10');
        this.game.classList.add('z-40');
    }

    private hiddenNextButton() {
        if (this.tutorialsSteps.length <= 3) return;
        let selected = document.querySelectorAll('.card-module--selected');
        if (selected.length == 4) {
            this.nextButton.classList.remove('hidden');
        } else {
            this.nextButton.classList.add('hidden');
        }
    }

    private thirdStep() {
        let buttons = document.querySelector('.buttons')!;
        let cards = document.querySelectorAll('.card-module input[type="checkbox"]');
        this.tutorial.style.transform = 'translate(-50%, 0)';
        this.tutorial.classList.add(this.mobile ? 'top-0' : 'bottom-0');

        this.tutorial.querySelector('p')!.innerHTML = "When you are ready, click on the submit button ! Be careful, you have only 4 lives.";
        this.tutorial.querySelector('h1')!.innerHTML = "Moment of truth";

        this.nextButton.classList.add('hidden');
        let submitButton = document.querySelector('button[data-id="submit"]')! as HTMLButtonElement;
        submitButton.classList.remove('button--disabled');
        submitButton.disabled = false;
        submitButton.addEventListener('click', () => {
            if (this.skipTutorial) return;
            this.tutorial.classList.remove('bottom-0');
            this.tutorial.classList.remove('bottom-4');
            Utils.sleep(1500).then(() => {
                let solved = StorageManager.groupsSolved;
            
                if (solved.length >= 1) {
                    this.shiftingSteps();
                } else {
                    this.shiftingSteps(2);
                }
            });
        });

        buttons.classList.remove('-z-10');
        buttons.classList.add('z-40');
    }

    private correctGroup() {
        let buttons = document.querySelector('.buttons')!;
        this.tutorial.classList.add('top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2');

        this.tutorial.querySelector('h1')!.innerHTML = "Congratulations!";
        this.tutorial.querySelector('p')!.innerHTML = "Congratulations! You solved your first group. You can click on the items to see more information on the wiki ! Have fun !";
        
        this.nextButton.remove();
        this.skipButton.innerHTML = "Close tutorial";

        this.game.classList.remove("z-40");
        this.game.classList.add("-z-10");
        buttons.classList.remove("z-40");
        buttons.classList.add("-z-10");
    }

    private wrongGroup() {
        let buttons = document.querySelector('.buttons')!;
        this.tutorial.classList.add('top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2');

        this.tutorial.querySelector('h1')!.innerHTML = "Oh no! Anyway...";
        this.tutorial.querySelector('p')!.innerHTML = "You lost a life. You can try again to solve the group. You can't guess the same group twice. If you guess a group, you can click on items to see more information on the wiki. Have fun !";
        
        this.nextButton.remove();
        this.skipButton.innerHTML = "Close tutorial";

        this.game.classList.remove("z-40");
        this.game.classList.add("-z-10");
        buttons.classList.remove("z-40");
        buttons.classList.add("-z-10");
    }

    private addEvents() {
        this.nextButton.addEventListener('click', () => {
            this.shiftingSteps();
        });

        this.skipButton.addEventListener('click', () => {
            this.removeTutorial();
        });
    }

    private shiftingSteps(shift = 1) {
        for (let i = 0; i < shift; i++) {
            this.tutorialsSteps.shift();
        }
        if (this.tutorialsSteps.length === 0) {
            this.removeTutorial();
        } else {
            this.tutorialsSteps[0]();
        }
    }

    private removeTutorial() {
        this.tutorialBackground.classList.add('hidden');
        this.tutorial.classList.add('hidden');
        this.skipTutorial = true;
        StorageManager.modal = false;
        this.game_.resetTimer();

        let elements = document.querySelectorAll('.-z-10');
        elements.forEach(element => {
            element.classList.remove('-z-10');
        });

        elements = document.querySelectorAll('.z-40');
        elements.forEach(element => {
            element.classList.remove('z-40');
        });
    }
}

export default Tutorial;
