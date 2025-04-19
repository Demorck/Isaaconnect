import { Loader } from "@/Loader";
import { MainGame } from "@/MainGame/Models/MainGame";
import { MainGameController } from "@/MainGame/Controllers/MainGameController";
import { MainGameView } from "@/MainGame/Views/MainGameView";
import { StorageManager } from "@/Shared/Helpers/Data/StorageManager";
import Tutorial from "@/MainGame/Views/Tutorial";
import {decodeOptions, encodeOptions, fromBase64url, Options, toBase64url} from "@/Shared/Helpers/Test";

let TEST = "AAgAQAEDBw+PAAQkZOQAAgYOHl7eAAIKKmrqACBg4AACBiZm5gAAEAACBiYAAhKSAAgoaOgAAgpKygACChpa2gACBiZm5gBAAAIGDi5u7gACElLSAAgoaOgAEFDQAEAAAkLCAEAAAgZGxgAQUNAAAkLCAAQkZOQAAkLCAAIGRsYACCho6AACCkrKAAQkZOQAQAACElLSAAQMHFzcAEAACCho6AAQUNAAAgpKygACElLSAAQkZOQAQAAEDBxc3AACQsIAAgoaWtoAAgpKygAACBiYAAIGDh4+fgACggACBoYACCgAAgYOLm4ABAwcXNwBAwsbO3sBAxOTAAgoaOgAAgpKygACChpa2gACBiZm5gBAAAIGDi5u7gACElLSAAgoaOgAEFDQAEAABAwcXNwAAgoqauoAAgoaWtoABETEAAIKSsoABCRk5AACBiZm5gBAAAIGDh5e3gAEDBxc3ABAAAgoaOgAEFDQAAIKSsoAAgoaWtoAAAIGDh6eAASEAQUBAwcXlwEFFZUABAwcPHwBBQ0tAQMHJwACBoYAEFDQAAJCwgAEJGTkAAJCwgACBkbGAAgoaOgAAgpKygAEJGTkAAIGJmbmAAIGDk4AQAACBiZm5gAIKGjoAAJCwgAEJGTkAAgoaOgAAhJS0gAEDBxc3AACBg5OzgBAAAISUtIACCho6AACCkrKAAIKGlraAAIGJmbmAAAISAACCho6AQODAQUNHV0ABAwcPHz8AAISMnIAAgoaWgACQsIAAhKSAAgoaOgAAgpKygACChpa2gACBiZm5gBAAAgoaOgAEFDQAAJCwgAIKGjoAEAABCRk5AACCkrKACBg4AAIGFjYAAJCwgACBkbGAAIKSsoAQAACEpIAAgYmZuYAAkLCAAJCwgACBkbGAAIGDk4AAgYmZuYAQAAIKGjoAAIKSsoAAkLCAAQkZOQAAgYmZuYAAAQkZOQAAgYWAQkpaQAIiAAQUAEFDU0BBQ0tbe0ACBhYAAISkgAIKGjoAAIKSsoAAgoaWtoAAgYmZuYAQAACBg4ubu4AAhJS0gAIKGjoABBQ0ABAAAQMTMwAAhJS0gAEJGTkAAIKSsoAQAACElLSAAQMHFzcAEAACCho6AAQUNAAAgpKygACElLSAAQkZOQAQAACBiZm5gAgYOAABCRk5AACElLSAAgoaOgAAgpKygAACAAISAEAAgACBg4ubgACChpa2gACBg4ePr4BAwsbO3sAAhKSAAgoaOgAAgpKygACChpa2gACBiZm5gBAAAgoaOgAEFDQAAJCwgAIKGjoAEAAAkLCAAQkZOQAAgpKygBAAAIKKmrqAAIGJmbmAAIKSsoACBhY2AACCkrKAAIGJmbmAAIGJmbmAEAAAgYOLm7uAAISUtIACCho6AAQUNAAAgYOHl7eAAIKKmrqAAgoaOgAQAAgYOAAAhJS0gACBkbGAAIGFlbWAAIKKmrqACBg4AACBiZm5gAAIAEDCxtb2wAEDEwBAwsra+sBBQ0dXQEFDS0AAgYWVgACCho6AQMTkwAIKGjoAAIKSsoAAgoaWtoAAgYmZuYAQAAIKGjoABBQ0AACQsIACCho6ABAAAIGRsYAAkLCAAQMHFzcAEAAAgZGxgACQsIAAgoqauoAAgYmZuYAAgpKygBAAAIGRsYAAgYOHl7eAAQMHFzcAAQMTMwAAgoqauoAAgYmZuYAAhJS0gACBg4eXt4ABAwcXNwAAAKCAQMjowEFDQACCho6evoAAiJi4gEFRQEDBycBCRmZARGRAAIKSsoAAkLCAAhIyAACBg5OzgACCkrKAAJCwgAEJGTkAAACBg4urgACABAwsAEDBw8fPwERUQEDBxc3twACEjKyAQUNTc0A";

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();

    let tutorial = StorageManager.lastIsaaconnect === 0;
    const query = new URLSearchParams(window.location.search);
    
    let game = new MainGame(false);
    let gameView = new MainGameView('#cards-game');
    let gameController = new MainGameController(game, gameView);

    let groups = game.getGroups();

    let options : Options = {
        health: StorageManager.randomHealth,
        enabled_blind: StorageManager.revealSubmittedBlind,
        numer_blind: StorageManager.numberOfBlindItems,
        count_names: StorageManager.numberOfGroups,
        count_ids: StorageManager.numberOfItems * StorageManager.numberOfGroups,
        names: [],
        ids: []
    }

    groups.forEach((group) => {
        let name = group.getName();
        let items = group.getSelectedItemsIds();
        options.names.push(name);
        options.ids.push(...items);
    });

    const encoded = encodeOptions(options);
    const base64url = toBase64url(encoded);
    console.log(base64url);

    const decoded = decodeOptions(fromBase64url(base64url));
    console.log(decoded);

    
    await Loader.loadComplete();

    if (tutorial) {
        let tutorialView = new Tutorial(gameController);
    }

});