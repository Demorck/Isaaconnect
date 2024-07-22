import { ThemeController } from "../Shared/Controllers/ThemeController.js";
import { Loader } from "../Loader.js";
import { MainGroupCreator } from "./Models/MainGroupCreator.js";
import { MainGroupCreatorView } from "./Views/MainGroupCreatorView.js";
import { MainGroupCreatorController } from "./Controllers/MainGroupCreatorController.js";

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();

    const mainGroupCreator = new MainGroupCreator();
    const mainGroupCreatorView = new MainGroupCreatorView();
    const mainGroupCreatorController = new MainGroupCreatorController(mainGroupCreator, mainGroupCreatorView);

});