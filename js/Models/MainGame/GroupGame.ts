import { Constants } from "../../Helpers/Constants.js";
import { Utils } from "../../Helpers/Utils.js";
import { Group } from "../Group.js";
import { Item } from "../Item.js";

export class GroupGame extends Group implements Iterable<Item> {
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

            this.selectedItems.push(item);
            bannedItem.push(item);
        }
        return this.selectedItems;
    }

    public isItemInGroup(item: Item): boolean;
    public isItemInGroup(id: number): boolean;
    public isItemInGroup(itemOrId: Item | number): boolean {
        if (typeof itemOrId === 'number') {
            return this.selectedItems.findIndex(item => item.getId() === itemOrId) !== -1;
        } else {
            return this.selectedItems.findIndex(item => item.getId() === itemOrId.getId()) !== -1;
        }
    }

    public [Symbol.iterator](): Iterator<Item> {
        let index = 0;
        return {
            next: () => {
                if (index < this.selectedItems.length) {
                    return {
                        done: false,
                        value: this.selectedItems[index++]
                    };
                } else {
                    return {
                        done: true,
                        value: null
                    };
                }
            }
        };
    }
}