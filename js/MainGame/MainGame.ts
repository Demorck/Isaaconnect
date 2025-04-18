import { Loader } from "@/Loader";
import { MainGame } from "@/MainGame/Models/MainGame";
import { MainGameController } from "@/MainGame/Controllers/MainGameController";
import { MainGameView } from "@/MainGame/Views/MainGameView";
import { StorageManager } from "@/Shared/Helpers/Data/StorageManager";
import Tutorial from "@/MainGame/Views/Tutorial";
import {ChangelogsView} from "@/Shared/Views/ChangelogsView";
import {Utils} from "@/Shared/Helpers/Utils";
import {Constants} from "@/Shared/Helpers/Constants";

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();

    let tutorial = StorageManager.lastIsaaconnect === 0;
    let game = new MainGame();
    let gameView = new MainGameView('#cards-game');
    let gameController = new MainGameController(game, gameView);
    
    await Loader.loadComplete();
    let newVersion: boolean = Utils.checkIfNewVersion();
    if (newVersion)
    {
        StorageManager.version = Constants.VERSION;
        let changelog = new ChangelogsView();
        changelog.setCurrentController(gameController);
        changelog.showNewChangelogs();
    }

    if (tutorial) {
        let tutorialView = new Tutorial(gameController);
    }


    StorageManager.modal = tutorial ||  newVersion;

});