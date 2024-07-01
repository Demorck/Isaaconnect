import { ThemeController } from './Controllers/ThemeController.js';
import { Loader } from './Loader.js';
import { MainGame } from './Models/MainGame/MainGame.js';
import { MainGameController } from './Controllers/MainGame/MainGameController.js';
import { MainGameView } from './Views/MainGame/MainGameView.js';


document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();

    let game = new MainGame();
    let gameView = new MainGameView('#cards-game');
    let gameController = new MainGameController(game, gameView);

    const themeController = new ThemeController();
});