import {Loader} from "@/Loader";
import {MainGame} from "@/MainGame/Models/MainGame";
import {MainGameController} from "@/MainGame/Controllers/MainGameController";
import {MainGameView} from "@/MainGame/Views/MainGameView";
import {Constants} from "@/Shared/Helpers/Constants";
import {decodeOptions, fromBase64url} from "@/Shared/Helpers/Permalink";
import {GroupGame} from "@/MainGame/Models/GroupGame";
// BAAAAgQmSXRlbXMgdGhhdCBvbmx5IHRyaWdnZXIgb24gZW5lbXkgZGVhdGgRUGxhbmV0YXJpdW0gaXRlbXMBmwKsAOoB0gJSAk4CVQJM
document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();

    let elements = document.querySelectorAll('[data-custom="true"]') as NodeListOf<HTMLElement>;
    elements.forEach((el) => {
        el.classList.add('hidden');
    });

    let element_custom = document.querySelectorAll('[data-custom="false"]');


    await Loader.loadComplete();

    let play_button = document.querySelector('#play')!;
    let textarea = document.querySelector('#textarea')! as HTMLTextAreaElement;
    let errors = document.getElementsByClassName('errors')[0] as HTMLUListElement;


    textarea.value = extractPayload(window.location.href);
    play_button.addEventListener('click', (e) => {
        let value = textarea.value;
        if (!value) {
            let el = get_error_li("Please paste a valid string", new Error("Empty input"));
            errors.appendChild(el);
            return;
        }

        try {
            const options = decodeOptions(fromBase64url(value));
            console.log(options);
            let groups_game: GroupGame[] = [];

            for (let i = 0; i < options.count_names; i++) {
                let name = escapeHtml(options.names[i]);

                let group = new GroupGame(name, [], 0, []);
                group.setIndex(i);

                for (let j = 0; j < options.count_ids; j++) {
                    let id = options.ids[j + i * options.count_ids];
                    let item_found = Constants.ITEMS.find(group => group.getId() == id);
                    if (!item_found) {
                        let el = get_error_li(`Failed to parse the string`, new Error(`Item with id ${id} not found.`));
                        errors.appendChild(el);
                        return;
                    }

                    group.pushSelectedItems(item_found);
                }

                groups_game.push(group);
            }

            let mainGame = new MainGame(false, groups_game);
            Constants.OPTIONS.HEALTH = options.health;
            Constants.OPTIONS.NUMBER_OF_BLIND_ITEMS = options.numer_blind;
            Constants.OPTIONS.NUMBER_OF_ITEMS = options.count_ids;
            Constants.OPTIONS.NUMBER_OF_GROUPS = options.count_names;
            mainGame.custom();
            console.log(mainGame.getHealth())
            let gameView = new MainGameView('#cards-game');

            let gameController = new MainGameController(mainGame, gameView);


            elements.forEach((el) => el.classList.remove('hidden'));
            element_custom.forEach((element) => element.classList.add('hidden'));
            
        } catch (error) {
            let el = get_error_li("Failed to parse the string, please past it in the #bug-section in discord if you think it's anormal", error as Error);
            errors.innerHTML = "";
            errors.appendChild(el);
        }
    })

});

function escapeHtml(unsafe: string): string{
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function get_error_li(message: string, error: Error): HTMLLIElement
{
    let el = document.createElement("li");
    el.innerHTML = message + "<br>" + error.message;
    return el;
}

function extractPayload(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
}