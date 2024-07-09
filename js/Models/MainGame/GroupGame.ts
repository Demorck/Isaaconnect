import { Constants } from "../../Helpers/Constants.js";
import { GroupData } from "../../Helpers/Data/GroupData.js";
import { Utils } from "../../Helpers/Utils.js";
import { Group } from "../Group.js";
import { Item } from "../Item.js";

export class GroupGame extends Group implements Iterable<Item> {
    private selectedItems: Item[];
    private index = 0;
    private solved = false;

    constructor(name: string, items: Item[], difficulty: number) {
        super(name, items, difficulty);
        this.selectedItems = [];
    }

    public getSelectedItems(): Item[] {
        return this.selectedItems;
    }

    public getSelectedItemsIds(): number[] {
        return this.selectedItems.map(item => item.getId());
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

        this.selectedItems = itemsPicked;
        return itemsPicked;
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

    public isSolved(): boolean {
        return this.solved;
    }

    public setSolved(solved: boolean = true, notify: boolean = false): void {
        this.solved = solved;

        if (notify) {
            this.notifyObservers({ solved: true, index: this.index, items: this.selectedItems, name: this.getName() });
        }
    }

    public setIndex(index: number): void {
        this.index = index;
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

    public override getData(): GroupData {
        return {
            name: this.getName(),
            items: this.selectedItems.map(item => item.getData()),
            difficulty: this.getDifficulty(),
            tags: this.getTags(),
            index: this.index  
        };
    }

    forEach(callback: (item: Item) => void) {
        for (const item of this) {
          callback(item);
        }
      }
}