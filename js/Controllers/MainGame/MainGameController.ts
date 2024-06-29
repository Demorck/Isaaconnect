import { MainGame } from "../../Models/MainGame/MainGame.js";
import { MainGameView } from "../../Views/MainGame/MainGameView.js";
import { GroupGameController } from "./GroupGameController.js";
import { GroupGameView } from "../../Views/MainGame/GroupGameView.js";
import { Utils } from "../../Helpers/Utils.js";
import { Constants } from "../../Helpers/Constants.js";

export class MainGameController {
    private game: MainGame;
    private gameView: MainGameView;
    private itemsIndex: number[] = [];
    private groupsController: GroupGameController[] = [];

    constructor(game: MainGame, gameView: MainGameView) {
        this.game = game;
        this.gameView = gameView;

        this.itemsIndex = Array.from({ length: Constants.NUMBER_OF_GROUPS * Constants.NUMBER_OF_ITEMS }, (_, i) => i);

        this.game.getGroups().forEach(group => {
            let groupView = new GroupGameView('cards-game');
            this.groupsController.push(new GroupGameController(group, groupView));
        });
        
        this.shuffleCard();
        this.addEventListeners();
        this.game.addObserver(this.gameView);
    }

    public shuffleCard = () => {
        let container = this.gameView.getItemsContainer();
        let labels = Array.from(document.querySelectorAll('.card-module'));
        container.innerHTML = '';
        Utils.shuffleArray(labels).forEach(label => container.appendChild(label));
        // this.applyBorderRadius();
    }

    private addEventListeners(): void {        
        let checkboxes = document.querySelectorAll<HTMLInputElement>('.card-module input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {                
                let numberSelected = document.querySelectorAll('.card-module--selected').length;
                if (numberSelected == 4) {
                    checkboxes.forEach(otherCheckbox => {
                        let element = otherCheckbox.parentNode as Element;
                        if (!element.classList.contains('card-module--selected'))
                        {
                            element.classList.add('card-module--disabled');
                            otherCheckbox.disabled = true;
                        }
                    })

                    this.gameView.toggleSubmitButton(false);
                } else {
                    checkboxes.forEach(otherCheckbox => {
                        let element = otherCheckbox.parentNode as Element;
                        element.classList.remove('card-module--disabled');
                        otherCheckbox.disabled = false;
                    })

                    this.gameView.toggleSubmitButton(true);
                }
            });
        });
    }
}

[
    5,
    10,
    2,
    13,

    6,
    15,
    0,
    12,

    14,
    11,
    3,
    9,

    7,
    1,
    8,
    4
]