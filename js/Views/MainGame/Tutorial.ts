import { StorageManager } from "../../Helpers/Data/StorageManager.js";

class Tutorial {
    private tutorialBackground: HTMLElement;
    private game: HTMLElement;
    private tutorial: HTMLElement;
    private nextButton: HTMLElement;
    private skipButton: HTMLElement;
    private tutorialsSteps: Array<() => void>;
    private mobile: boolean;

    constructor() {
        this.tutorialBackground = document.getElementById('tutorial-background')!;
        this.game = document.getElementById('cards-game')!;
        this.tutorial = document.getElementById('tutorial')!;
        this.nextButton = document.querySelector('[data-id="next"]')!;
        this.skipButton = document.querySelector('[data-id="skip"]')!;
        this.mobile = window.innerWidth < 768;
        this.tutorialsSteps = [this.firstStep.bind(this), this.secondStep.bind(this), this.thirdStep.bind(this), this.correctGroup.bind(this), this.wrongGroup.bind(this)];
    }

    public showTutorial() {
        this.tutorialBackground.classList.remove('hidden');
        this.tutorial.classList.remove('hidden');
        this.tutorial.classList.add('top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2');
        this.addEvents();
        this.tutorialsSteps[0]();
    }

    private firstStep() {
        let title = document.getElementById('title')!;
        let buttons = document.querySelector('.buttons')!;
        let shuffleMobile = document.querySelector('.shuffle-mobile')!;

        this.game.classList.add('-z-10');
        title.classList.add('-z-10');
        buttons.classList.add('-z-10');
        shuffleMobile.classList.add('-z-10');
    }

    private secondStep() {
        this.nextButton.classList.add('hidden');
        this.tutorial.style.transform = 'translate(-50%, 0%)';
        this.tutorial.classList.remove('top-1/2');

        this.tutorial.querySelector('p')!.innerHTML = "There are 4 groups to solve. Each group are 4 items with one thing in common. It can be an effect in the game, a shape on it, a transformation or completely a thing out of the game. You can click on the cards to select or deselect them. <br> Now, try to solve a group by clicking on 4 cards.";
        this.tutorial.querySelector('h1')!.innerHTML = "Solve the groups";
        let cards = document.querySelectorAll('.card-module input[type="checkbox"]');
        cards.forEach(card => {
            card.addEventListener('change', () => {
                let selected = document.querySelectorAll('.card-module--selected');
                if (selected.length == 4) {
                    this.nextButton.classList.remove('hidden');
                } else {
                    this.nextButton.classList.add('hidden');
                }
            });
        });

        this.game.classList.remove('-z-10');
        this.game.classList.add('z-40');
    }

    private thirdStep() {
        let buttons = document.querySelector('.buttons')!;
        this.tutorial.style.transform = 'translate(-50%, 0)';
        this.tutorial.classList.add(this.mobile ? 'bottom-4' : 'bottom-0');

        this.tutorial.querySelector('p')!.innerHTML = "When you are ready, click on the submit button ! Be careful, you have only 4 lives.";
        this.tutorial.querySelector('h1')!.innerHTML = "Moment of truth";

        this.nextButton.classList.add('hidden');
        let submitButton = document.querySelector('button[data-id="submit"]')! as HTMLButtonElement;
        submitButton.classList.remove('button--disabled');
        submitButton.disabled = false;
        submitButton.addEventListener('click', () => {
            let solved = StorageManager.groupsSolved;
            this.tutorial.classList.remove('bottom-0');
            this.tutorial.classList.remove('bottom-4');
            if (solved.length >= 1) {
                this.shiftingSteps();
            } else {
                this.shiftingSteps(2);
            }
        });

        buttons.classList.remove('-z-10');
        buttons.classList.add('z-40');
    }

    private correctGroup() {
        let buttons = document.querySelector('.buttons')!;
        this.tutorial.classList.add('top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2');
        this.tutorial.style.transform = 'translate(-50%, -50%)';

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
        this.tutorial.style.transform = 'translate(-50%, -50%)';

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
        this.game.classList.remove('-z-10');
    }
}

export default Tutorial;