import { GroupData } from "../../Shared/Helpers/Data/GroupData.js";
import { Utils } from "../../Shared/Helpers/Utils.js";
import { Group } from "../../Shared/Models/Group.js";
import { Item } from "../../Shared/Models/Item.js";
import { StorageManager } from "../../Shared/Helpers/Data/StorageManager.js";

export class GroupGame extends Group implements Iterable<Item> {
    private selectedItems: Item[];
    private index = 0;
    private solved = false;

    constructor(name: string, items: Item[], difficulty: number, tags: string[] | undefined) {
        super(name, items, difficulty, tags);
        this.selectedItems = [];
    }

    public getSelectedItems(): Item[] {
        return this.selectedItems;
    }

    public getSelectedItemsIds(): number[] {
        return this.selectedItems.map(item => item.getId());
    }
    
    public getRandomItems(bannedItem: Item[], daysBefore = 0, seeded: boolean): Item[] | null {
        let itemsPicked: Item[] = [];
        let numberOfItems = StorageManager.randomSettings.numberOfItems;
        for (let i = 0; i < numberOfItems; i++) {
            let item: Item | null;
            item = this.getRandomItem(bannedItem, daysBefore, seeded, i);

            if (item === null)
                return null;

            itemsPicked.push(item);
            bannedItem.push(item);
        }

        this.selectedItems = itemsPicked;
        return itemsPicked;
    }

    public getRandomItem(bannedItem: Item[], daysBefore = 0, seeded: boolean, i: number): Item | null {
        let item: Item;
        let counter = 0;
        do {
            let indexGroup;
            if (seeded) {
                indexGroup = Math.floor(Utils.getSeed(i + counter, daysBefore) * this.getItems().length);
            } else {
                indexGroup = Math.floor(Math.random() * this.getItems().length);
            }
            item = this.getItems()[indexGroup];
            counter++;                
        } while (bannedItem.includes(item) && counter < 1000);

        if (counter >= 1000) {
            return null;
        }

        return item;
    }

    public howManyItemsLeft(bannedItems: Item[]): number {
        return this.getItems().filter(item => !bannedItems.includes(item)).length;
    }

    public changeSelectedItems(selectedItems: Item[], bannedItems: Item[], seeded: boolean): void {
        this.selectedItems.forEach(item => item
        );
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