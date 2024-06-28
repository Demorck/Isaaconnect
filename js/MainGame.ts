import { Item } from './Models/Item.js';
import { ItemController } from './Controllers/MainGame/ItemController.js';
import { ItemView } from './Views/MainGame/ItemView.js';
import { Constants } from './Helpers/Constants.js';
import { ThemeController } from './Controllers/ThemeController.js';
import { Loader } from './Loader.js';
import { MainGame } from './Models/MainGame/MainGame.js';


document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();      

    for (let i = 1; i <= Constants.NUMBER_OF_ITEMS * Constants.NUMBER_OF_GROUPS; i++) {
        let item = new Item(i, '');
        let itemView = new ItemView('cards-module', item);
        let itemController = new ItemController(item, itemView);
        item.notifyObservers(item);
        itemController.addEventListeners();
    }

    let game = new MainGame();

    const themeController = new ThemeController();
});