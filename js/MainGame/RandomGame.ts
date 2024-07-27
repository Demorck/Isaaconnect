import { Loader } from '../Loader.js';
import { MainGame } from './Models/MainGame.js';
import { MainGameController } from './Controllers/MainGameController.js';
import { MainGameView } from './Views/MainGameView.js';
import { StorageManager } from '../Shared/Helpers/Data/StorageManager.js';
import Tutorial from './Views/Tutorial.js';


document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();

    let tutorial = StorageManager.lastIsaaconnect === 0;
    
    let game = new MainGame(false);
    let gameView = new MainGameView('#cards-game');
    let gameController = new MainGameController(game, gameView);

    if (tutorial) {
        let tutorialView = new Tutorial();
    }

});