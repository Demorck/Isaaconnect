import { Loader } from "@/Loader";
import {MainGameCreatorController} from "@/GameCreator/Controllers/MainGameCreatorController";

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();

    let controller = new MainGameCreatorController();

    await Loader.loadComplete();


});