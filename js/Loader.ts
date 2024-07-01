import { StorageManager } from "./Helpers/Data/StorageManager.js";
import { Constants } from "./Helpers/Constants.js";
import { Utils } from "./Helpers/Utils.js";
import { DataFetcher } from "./Helpers/DataFetcher.js";
import { Item } from "./Models/Item.js";
import { Group } from "./Models/Group.js";

/**
 * @description Loader class that loads the page
 *
 * @export
 * @class Loader
 */
export class Loader {
    constructor() {}
    
    /**
     * @description Load the page.
     *
     * @static
     * @async
     * @returns {Promise<void>}
     */
    static async load(): Promise<void> {
        const { items, groups } = await DataFetcher.fetchData();

        items.forEach((item: { id: number; alias: string; }) => {
            Constants.ITEMS.push(new Item(item.id, item.alias));
        });

        groups.forEach((group: { name: string, items: number[], difficulty: number; }) => {
            let items: Item[] = [];
            group.items.forEach((itemId: number) => {
                let item = Constants.ITEMS.find((item: Item) => item.getId() === itemId);
                if (item) {
                    items.push(item);
                }
            });
            Constants.GROUPS.push(new Group(group.name, items, group.difficulty));
        });

        let theme = StorageManager.theme;
        if (theme === null) theme = 'basement-theme';
        if (theme === 'void-theme') {
            do {
                let randomValue = Constants.THEMES[Math.floor(Math.random() * Constants.THEMES.length)];
                theme = randomValue;
            } while (theme === 'void-theme');
        }
        let body = document.querySelector('body');
        if (body) body.classList.add(theme);

        /**
         * @param elementOrSelector The element or selector to set visible
         * @param visible True if the element should be visible, false otherwise
         * @returns nothing if the element is not found
         */
        const setVisible = (elementOrSelector: string, visible: boolean) => {
            const element = document.querySelector<HTMLElement>(elementOrSelector);
            if (!element) {
                return;
            }
            element.style.display = visible ? 'flex' : 'none';
        }

        setVisible('.page', false);
        setVisible('.loader', true);

        await Utils.sleep(1000);

        setVisible('.page', true);
        setVisible('.loader', false);
    }
}
