import { GroupData } from "../../Shared/Helpers/Data/GroupData.js";
import { Utils } from "../../Shared/Helpers/Utils.js";
import { Group } from "../../Shared/Models/Group.js";
import { Item } from "../../Shared/Models/Item.js";
import { StorageManager } from "../../Shared/Helpers/Data/StorageManager.js";
import { Constants } from "../../Shared/Helpers/Constants.js";

/**
 * Represents a group game with selected items and various game-related methods.
 * 
 * @export
 * @class GroupGame
 * @extends {Group}
 * @implements {Iterable<Item>}
 */
export class GroupGame extends Group implements Iterable<Item> {
    private selectedItems: Item[];
    private index = 0;
    private solved = false;

    /**
     * Creates an instance of GroupGame.
     * @param {string} name - The name of the group.
     * @param {Item[]} items - The items in the group.
     * @param {number} difficulty - The difficulty level of the group.
     * @param {string[] | undefined} tags - The tags associated with the group.
     */
    constructor(name: string, items: Item[], difficulty: number, tags: string[] | undefined) {
        super(name, items, difficulty, tags);
        this.selectedItems = [];
    }

    /**
     * Gets the selected items.
     * @returns {Item[]} The selected items.
     */
    public getSelectedItems(): Item[] {
        return this.selectedItems;
    }

    /**
     * Gets the IDs of the selected items.
     * @returns {number[]} The IDs of the selected items.
     */
    public getSelectedItemsIds(): number[] {
        return this.selectedItems.map(item => item.getId());
    }

    /**
     * Gets random items that are not banned.
     * @param {Item[]} bannedItem - The items to be excluded.
     * @param {number} [daysBefore=0] - The number of days before today.
     * @param {boolean} seeded - Whether to use seeded randomization.
     * @returns {Item[] | null} The selected items or null if no items can be selected.
     */
    public getRandomItems(bannedItem: Item[], daysBefore = 0, seeded: boolean): Item[] | null {
        let itemsPicked: Item[] = [];
        let numberOfItems = seeded ? Constants.NUMBER_OF_ITEMS : StorageManager.randomSettings.numberOfItems;
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

    /**
     * Gets a random item that is not banned.
     * @param {Item[]} bannedItem - The items to be excluded.
     * @param {number} [daysBefore=0] - The number of days before today.
     * @param {boolean} seeded - Whether to use seeded randomization.
     * @param {number} i - The index for seeding.
     * @returns {Item | null} The selected item or null if no item can be selected.
     */
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

    /**
     * Gets the number of items left that are not banned.
     * @param {Item[]} bannedItems - The items to be excluded.
     * @returns {number} The number of items left.
     */
    public howManyItemsLeft(bannedItems: Item[]): number {
        return this.getItems().filter(item => !bannedItems.includes(item)).length;
    }

    /**
     * Changes the selected items.
     * @param {Item[]} selectedItems - The new selected items.
     * @param {Item[]} bannedItems - The items to be excluded.
     * @param {boolean} seeded - Whether to use seeded randomization.
     */
    public changeSelectedItems(selectedItems: Item[], bannedItems: Item[], seeded: boolean): void {
        this.selectedItems.forEach(item => item);
    }

    /**
     * Checks if an item is in the group by item or item ID.
     * @param {Item | number} itemOrId - The item or item ID to check.
     * @returns {boolean} True if the item is in the group, false otherwise.
     */
    public isItemInGroup(item: Item): boolean;
    public isItemInGroup(id: number): boolean;
    public isItemInGroup(itemOrId: Item | number): boolean {
        if (typeof itemOrId === 'number') {
            return this.selectedItems.findIndex(item => item.getId() === itemOrId) !== -1;
        } else {
            return this.selectedItems.findIndex(item => item.getId() === itemOrId.getId()) !== -1;
        }
    }

    /**
     * Checks if the group is solved.
     * @returns {boolean} True if the group is solved, false otherwise.
     */
    public isSolved(): boolean {
        return this.solved;
    }

    /**
     * Sets the solved state of the group.
     * @param {boolean} [solved=true] - The solved state.
     * @param {boolean} [notify=false] - Whether to notify observers.
     */
    public setSolved(solved: boolean = true, notify: boolean = false): void {
        this.solved = solved;

        if (notify) {
            this.notifyObservers({ solved: true, index: this.index, items: this.selectedItems, name: this.getName() });
        }
    }

    /**
     * Sets the index of the group.
     * @param {number} index - The new index.
     */
    public setIndex(index: number): void {
        this.index = index;
    }

    /**
     * Implements the iterable interface.
     * @returns {Iterator<Item>} The iterator for the selected items.
     */
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

    /**
     * Gets the group data.
     * @returns {GroupData} The group data.
     */
    public override getData(): GroupData {
        return {
            name: this.getName(),
            items: this.selectedItems.map(item => item.getData()),
            difficulty: this.getDifficulty(),
            tags: this.getTags(),
            index: this.index  
        };
    }

    /**
     * Applies a callback function to each item in the group.
     * @param {Function} callback - The callback function to apply.
     */
    public forEach(callback: (item: Item) => void): void {
        for (const item of this) {
            callback(item);
        }
    }
}
