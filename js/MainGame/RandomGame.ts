import { Loader } from "@/Loader";
import { MainGame } from "@/MainGame/Models/MainGame";
import { MainGameController } from "@/MainGame/Controllers/MainGameController";
import { MainGameView } from "@/MainGame/Views/MainGameView";
import { StorageManager } from "@/Shared/Helpers/Data/StorageManager";
import Tutorial from "@/MainGame/Views/Tutorial";

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();

    let tutorial = StorageManager.lastIsaaconnect === 0;
    
    let game = new MainGame(false);
    let gameView = new MainGameView('#cards-game');
    let gameController = new MainGameController(game, gameView);
    
    await Loader.loadComplete();

    if (tutorial) {
        let tutorialView = new Tutorial(gameController);
    }

});