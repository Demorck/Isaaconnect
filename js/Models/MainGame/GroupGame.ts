import { Constants } from "../../Helpers/Constants.js";
import { Utils } from "../../Helpers/Utils.js";
import { Group } from "../Group.js";
import { Item } from "../Item.js";

export class GroupGame extends Group {
    private selectedItems: Item[];

    constructor(name: string, items: Item[], difficulty: number) {
        super(name, items, difficulty);
        this.selectedItems = [];
    }

    public getSelectedItems(): Item[] {
        return this.selectedItems;
    }
    
    public getRandomItems(bannedItem: Item[], daysBefore = 0): Item[] | null {
        let itemsPicked: Item[] = [];
        let counter = 0;
        for (let i = 0; i < Constants.NUMBER_OF_ITEMS; i++) {
            let item: Item;
            do {
                let indexGroup = Math.floor(Utils.getSeed(i + counter, daysBefore) * this.getItems().length);
                item = this.getItems()[indexGroup];
                counter++;
            } while (bannedItem.includes(item));

            if (counter >= 1000) {
                return null;
            }

            itemsPicked.push(item);
            bannedItem.push(item);
        }
        return itemsPicked;
    }
}