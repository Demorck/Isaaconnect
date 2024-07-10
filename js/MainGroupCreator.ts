import { ThemeController } from "./Controllers/ThemeController.js";
import { Loader } from "./Loader.js";
import { MainGroupCreator } from "./Models/GroupCreator/MainGroupCreator.js";
import { MainGroupCreatorView } from "./Views/GroupCreator/MainGroupCreatorView.js";
import { MainGroupCreatorController } from "./Controllers/GroupCreator/MainGroupCreatorController.js";

document.addEventListener('DOMContentLoaded', async () => {
    const themeController = new ThemeController();
    await Loader.load();

    const mainGroupCreator = new MainGroupCreator();
    const mainGroupCreatorView = new MainGroupCreatorView();
    const mainGroupCreatorController = new MainGroupCreatorController(mainGroupCreator, mainGroupCreatorView);

});