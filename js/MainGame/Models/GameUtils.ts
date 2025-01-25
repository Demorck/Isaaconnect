import { Constants } from "@/Shared/Helpers/Constants";
import { Utils } from "@/Shared/Helpers/Utils";
import { Group } from "@/Shared/Models/Group";
import { Item } from "@/Shared/Models/Item";
import { GroupGame } from "@/MainGame/Models/GroupGame";
import { GameOptions } from "@/MainGame/Models/GameOptions";
import { Difficulties } from "@/Shared/Models/Enums/Difficulties";


/**
 * @description Class that contains the game logic 
 *
 * @export
 * @class GameUtils
 * @typedef {GameUtils}
 */
export class GameUtils {
    private options: GameOptions;

    constructor(options: GameOptions) {
        this.options = options;
    }
    
    /**
     * @description Generate a selection of groups for the game
     * TODO: Refactor this method
     *
     * @static
     * @param {number} [daysBefore=0] Number of days before the current day, used to avoid repeating groups
     * @param {Group[]} [alreadyBanned=[]] Groups that are already banned
     * @returns {GroupGame[]} The selected groups
     */
    public whileSelection(daysBefore: number = 0, alreadyBanned: Group[] = []): GroupGame[] {
        let bannedGroup: Group[] = alreadyBanned;
        let bannedItem: Item[] = [];
        let bannedTags: string[] = [];
        
        let selectedItems: Item[] = [];
        let selectedGroups: GroupGame[] = [];
        let difficultyFound = false;

        let counterGroup = 0;
        while (selectedGroups.length < Constants.OPTIONS.NUMBER_OF_GROUPS && counterGroup < 5 * Constants.NUMBER_OF_GROUPS) {
            
            let currentGroup = this.getRandomGroup(bannedGroup, daysBefore, difficultyFound, counterGroup, bannedTags);
            difficultyFound = this.checkDifficultyFound(currentGroup, difficultyFound);

            let counterItem = 0;
            let items: Item[] = [];
            while (items.length < Constants.OPTIONS.NUMBER_OF_ITEMS && counterItem < 5 * Constants.NUMBER_OF_GROUPS) {
                let result = currentGroup.getRandomItems(bannedItem, daysBefore, this.options);
                if (result === null) {
                    bannedGroup.push(currentGroup);
                    currentGroup = this.getRandomGroup(bannedGroup, daysBefore, difficultyFound, counterItem, bannedTags);
                    counterGroup++;
                    difficultyFound = this.checkDifficultyFound(currentGroup, difficultyFound);
                } else {
                    items = result;
                }
                counterItem++;
            }

            if (items.length < this.options.NUMBER_OF_ITEMS) {
                break;
            }
            
            selectedItems.push(...items);
            selectedGroups.push(currentGroup);
            bannedGroup.push(currentGroup);

            if (this.options.CHECK_GRID) {
                let result = this.checkGrid(selectedGroups, selectedItems);
                if (result.impossible) {
                    selectedGroups.pop();
                    for (let i = 0; i < this.options.NUMBER_OF_ITEMS; i++) {
                        selectedItems.pop();
                    }
                    counterGroup++;
                    continue;
                }
            }

            currentGroup.setIndex(selectedGroups.length - 1);
            if (Constants.OPTIONS.TAGS_BANNED)
                bannedTags.push(...currentGroup.getTags());
            
            currentGroup.getItems().forEach(item => {
                if (bannedItem.indexOf(item) === -1) {
                    bannedItem.push(item);
                }
            });
            
        }
        
        if (selectedGroups.length < this.options.NUMBER_OF_GROUPS)
        {
            let groupCounter = 0;
            difficultyFound = false;
            while (selectedGroups.length < this.options.NUMBER_OF_GROUPS && groupCounter < 5 * Constants.NUMBER_OF_GROUPS) {
                bannedItem = [];
                bannedGroup = [];
                bannedItem.push(...selectedItems);
                bannedGroup.push(...selectedGroups);
                let currentGroup = this.getRandomGroup(bannedGroup, daysBefore, difficultyFound, groupCounter, []);
                let items: Item[] | null = null;

                let itemCounter = 0;
                while (items == null && itemCounter < 1000) {
                    items = currentGroup.getRandomItems(bannedItem, daysBefore, this.options);
                    if (items === null) {
                        bannedGroup.push(currentGroup); 
                        currentGroup = this.getRandomGroup(bannedGroup, daysBefore, difficultyFound, groupCounter + itemCounter, []);
                    }
                    itemCounter++;                 
                }
                if (items === null) {
                    break;                    
                }

                selectedItems.push(...items);
                selectedGroups.push(currentGroup);
            }

            if (selectedGroups.length < this.options.NUMBER_OF_GROUPS) {
                this.options.NUMBER_OF_GROUPS = selectedGroups.length;
            }
        }

        if (Constants.OPTIONS.NUMBER_OF_BLIND_ITEMS > 0)
        {
            let blindArray: number[] = [];
            blindArray = Array.from(Array(Constants.options.NUMBER_OF_GROUPS * Constants.OPTIONS.NUMBER_OF_ITEMS).keys());
            
            for (let i = 0; i < Constants.OPTIONS.NUMBER_OF_BLIND_ITEMS; i++) {
                let index = Math.floor(Math.random() * blindArray.length);
                let itemIndex = blindArray[index];
                let groupIndex = Math.floor(itemIndex / Constants.OPTIONS.NUMBER_OF_ITEMS);

                selectedGroups[groupIndex].setBlindItem(itemIndex % Constants.OPTIONS.NUMBER_OF_ITEMS);
                blindArray.splice(index, 1);
            }
            
        }
        
        return selectedGroups;
    }
    
    
    private checkDifficultyFound(currentGroup: GroupGame, difficultyFound: boolean) {
        switch (Constants.OPTIONS.CUSTOM_DIFFICULTY) {
            case Difficulties.SUPER_EASY:
                if (currentGroup.getDifficulty() === 2) difficultyFound = true;
                break;
            case Difficulties.HARD:
                if (currentGroup.getDifficulty() === 1) difficultyFound = true;
                break;
            case Difficulties.NORMAL:
                if (currentGroup.getDifficulty() === 3) difficultyFound = true;
                break;
            default:
                break;
        }
        return difficultyFound;
    }

    /**
     * @description Get a random group from the list of groups with some restrictions
     *
     * @static
     * @param {Group[]} bannedGroup List of groups that are already banned
     * @param {number} [daysBefore=0] Number of days before the current day, used to avoid repeating groups
     * @param {boolean} [filterDifficulty=false] If the group should be filtered by difficulty
     * @param {number} [difficulty=1] The difficulty of the group to finnd
     * @param {number} [modifier=0] The modifier to apply to the random number
     * @param {string[]} [bannedTags=[]] List of tags that are banned
     * @param {boolean} seeded If the selection should be seeded
     * @returns {GroupGame}
     */
    private getRandomGroup(bannedGroup: Group[], daysBefore: number = 0, filterDifficulty: boolean = false, modifier: number = 0, bannedTags: string[] = []): GroupGame {
        let index: number, group: Group, i = 0;
        let groups = Constants.GROUPS;
        let numberOfItems = Constants.OPTIONS.NUMBER_OF_ITEMS;

        groups = this.filterGroupsByDifficulty(groups, filterDifficulty);

        do {
            if (Constants.OPTIONS.SEEDED)
                index = Math.floor(Utils.getSeed(i++ + modifier, daysBefore) * groups.length);
            else
                index = Math.floor(Math.random() * groups.length);
            group = groups[index];
        } while (bannedGroup.includes(group) || bannedTags.some(tag => group.getTags().includes(tag)) || group.getItems().length < numberOfItems);

        let selectedGroup = new GroupGame(group.getName(), group.getItems(), group.getDifficulty(), group.getTags());

        return selectedGroup;
    }

    
    private filterGroupsByDifficulty(groups: Group[], filterDifficulty: boolean) {
        switch (Constants.OPTIONS.CUSTOM_DIFFICULTY) {
            case Difficulties.SUPER_EASY:
                groups = groups.filter((group: Group) => group.getDifficulty() != 3);
                if (filterDifficulty) groups = groups.filter((group: Group) => group.getDifficulty() != 2);
                break;
            case Difficulties.EASY:
                groups = groups.filter((group: Group) => group.getDifficulty() != 3);
                break;
            case Difficulties.HARD:
                groups = groups.filter((group: Group) => group.getDifficulty() != 0);
                if (filterDifficulty) groups = groups.filter((group: Group) => group.getDifficulty() != 1);
                break;
            case Difficulties.ULTRA_HARD:
                groups = groups.filter((group: Group) => group.getDifficulty() != 0 && group.getDifficulty() != 1);
                break;
            case Difficulties.MAYEM:
                break;
            case Difficulties.NORMAL:
            default:
                if (filterDifficulty) groups = groups.filter((group: Group) => group.getDifficulty() !== 3);
                break;
        }

        return groups;
    }

    /**
     * @description Check if the grid is impossible to solve, Here impossible means that there are more than 4 items can be placed in one of selected groups
     *
     * @static
     * @param {GroupGame[]} groups The selected groups
     * @param {Item[]} allSelectedItems All the selected items
     * @param {number} [numberOfItems=Constants.OPTIONS.NUMBER_OF_ITEMS] The number of items to check
     * @returns {{ impossible: boolean, itemsNotInGroup: Item[] }} The result of the check. If the grid is impossible, the items that are not in the group are returned
     */
    public checkGrid(groups: GroupGame[], allSelectedItems: Item[]): { impossible: boolean, itemsNotInGroup: Item[] } {
        if (allSelectedItems.length < Constants.OPTIONS.NUMBER_OF_ITEMS) return { impossible: false, itemsNotInGroup: [] };
        let impossible = false;
        let itemsNotInGroup: Item[] = [];
        groups.forEach(group => {
            let allItemsInGroup = group.getItems();
            let selectedItems = allSelectedItems.filter(item => allItemsInGroup.includes(item));
            if (selectedItems.length > Constants.OPTIONS.NUMBER_OF_ITEMS)
            {
                let selectedInGroup = group.getSelectedItems();
                itemsNotInGroup = selectedItems.filter(item => !selectedInGroup.includes(item));
                impossible = true;
            }
        });

        // let allGroups = Constants.GROUPS;
        // let names = groups.map(group => group.getName());
        // allGroups = allGroups.filter(group => !names.includes(group.getName()));
        
        // allGroups.forEach(group => {
        //     if (impossible) return;
        //     let items = allSelectedItems.filter(item => group.getItems().includes(item));
            
        //     if (items.length == Constants.OPTIONS.NUMBER_OF_ITEMS)
        //     {
        //         impossible = true;
        //         itemsNotInGroup = items;

        //     }
        // })
        
        return { impossible, itemsNotInGroup };
    }

    /**
     * Find an item froms itemson by its id
     *
     * @param {number} id The id of the item
     * @returns {Item}
     */
    static findItemById(id: number): Item {
        let item = Constants.ITEMS.find(item => item.getId() === id);
        if (item === undefined)
            return Constants.ITEMS[185];
        return item;
    }

    
    /**
     * @description Find a group by its item
     *
     * @static
     * @param {Item | number} item The item to find
     * @param {GroupGame[]} groups The list of groups
     * @returns {GroupGame}
     */
    static findGroupByItem(item: Item, groups: GroupGame[]): GroupGame;
    static findGroupByItem(id: number, groups: GroupGame[]): GroupGame;
    static findGroupByItem(itemOrId: Item | number, groups: GroupGame[]): GroupGame {
        if (typeof itemOrId === 'number') {
            return groups.find(group => group.isItemInGroup(itemOrId)) as GroupGame;
        } else {
            return groups.find(group => group.isItemInGroup(itemOrId)) as GroupGame;
        }
    }
}