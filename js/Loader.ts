import { StorageManager } from "@/Shared/Helpers/Data/StorageManager";
import { Constants } from "@/Shared/Helpers/Constants";
import { Utils } from "@/Shared/Helpers/Utils";
import { DataFetcher } from "@/Shared/Helpers/DataFetcher";
import { Item } from "@/Shared/Models/Item";
import { Group } from "@/Shared/Models/Group";
import { initializeTooltipListener } from "@/Tooltips/Tooltips";
import { ThemeController } from "@/Shared/Controllers/ThemeController";

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
        let theme = StorageManager.theme;
        const themeController = new ThemeController(theme);
        
        const { items, groups } = await DataFetcher.fetchData();

        items.forEach((item: { id: number; alias: string; img: string }) => {
            Constants.ITEMS.push(new Item(item.id, item.alias, item.img));
        });

        StorageManager.initDefaultLocalStorage();

        groups.forEach((group: { name: string, items: number[], difficulty: number, tags: string[] | undefined }) => {
            let items: Item[] = [];
            group.items.forEach((itemId: number) => {
                let item = Constants.ITEMS.find((item: Item) => item.getId() === itemId);
                if (item) {
                    items.push(item);
                }
            });
            if (typeof group.tags === 'string') {
                group.tags = [group.tags];
            }
            if (group.tags === undefined) group.tags = [];
            let newGroup = new Group(group.name, items, group.difficulty, group.tags);
            
            
            group.tags.forEach((tag: string) => {
                newGroup.addTag(tag);
            });
            Constants.GROUPS.push(newGroup);
        });

        if (StorageManager.debug) {
            document.getElementById('tooltip-icons')!.innerHTML += `<span class="material-symbols-rounded md:text-4xl"  data-id="debug">
                    adb
                </span>`;
        }

        initializeTooltipListener();
    }

    static async loadComplete(): Promise<void> {
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
        
        await Utils.sleep(1000);

        setVisible('.page', true);
        setVisible('.loader', false);
    }
}
