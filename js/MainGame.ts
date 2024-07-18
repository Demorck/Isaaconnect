import { Loader } from './Loader.js';
import { MainGame } from './Models/MainGame/MainGame.js';
import { MainGameController } from './Controllers/MainGame/MainGameController.js';
import { MainGameView } from './Views/MainGame/MainGameView.js';
import { StorageManager } from './Helpers/Data/StorageManager.js';
import Tutorial from './Views/MainGame/Tutorial.js';
import { Utils } from './Helpers/Utils.js';


document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();

    Utils.checkIfNewVersion()

    let tutorial = StorageManager.lastIsaaconnect === 0;
    let game = new MainGame();
    let gameView = new MainGameView('#cards-game');
    let gameController = new MainGameController(game, gameView);

    if (tutorial) {
        let tutorialView = new Tutorial();
    }

});