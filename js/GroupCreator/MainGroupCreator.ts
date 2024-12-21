import { Loader } from "@/Loader";
import { MainGroupCreator } from "@/GroupCreator/Models/MainGroupCreator";
import { MainGroupCreatorView } from "@/GroupCreator/Views/MainGroupCreatorView";
import { MainGroupCreatorController } from "@/GroupCreator/Controllers/MainGroupCreatorController";

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();

    const mainGroupCreator = new MainGroupCreator();
    const mainGroupCreatorView = new MainGroupCreatorView();
    const mainGroupCreatorController = new MainGroupCreatorController(mainGroupCreator, mainGroupCreatorView);

});