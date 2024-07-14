import { Constants } from "../../Helpers/Constants.js";
import { Utils } from "../../Helpers/Utils.js";
import { Group } from "../Group.js";
import { Item } from "../Item.js";
import { GroupGame } from "./GroupGame.js";

export class GameUtils {
    static generateSelection(daysBefore = 0, alreadyBanned: Group[] = [], seeded = true): GroupGame[] {        
        let bannedGroup: Group[] = alreadyBanned;
        let bannedItem: Item[] = [];
        let bannedTags: string[] = [];
        let selectedItems: Item[] = [];
    
        let selectedGroups: GroupGame[] = [];
        let difficultyFound = false;
    
        for (let i = 0; i < Constants.NUMBER_OF_GROUPS; i++) {
            let currentGroup;
            currentGroup = GameUtils.getRandomGroup(bannedGroup, daysBefore, difficultyFound, i, 0, bannedTags, seeded);
            if (currentGroup.getDifficulty() === 3) {
                difficultyFound = true;
            }

            let items: Item[] | null;
            let attemptCount = 0;
            do {                
                items = currentGroup.getRandomItems(bannedItem, daysBefore, seeded, selectedItems);                
                if (items === null) {
                    bannedGroup.push(currentGroup);
                    currentGroup = GameUtils.getRandomGroup(bannedGroup, daysBefore, false, i, 1, bannedTags, seeded);
                }                
                attemptCount++;
            } while (items === null);

            selectedItems.push(...items);
            selectedGroups.push(currentGroup);
            bannedGroup.push(currentGroup);
            bannedTags.push(...currentGroup.getTags());
    
            currentGroup.setIndex(i);
            currentGroup.getItems().forEach(item => {
                if (bannedItem.indexOf(item) === -1) {
                    bannedItem.push(item);
                }
    
                // Constants.GROUPS.forEach(group => {
                //     if (group.getItems().indexOf(item) !== -1) {
                //         bannedGroup.push(group);
                //     }
                // });
            });
        }
        // console.log(selectedGroups);
        
        return selectedGroups;
    }
    

    static getRandomGroup(bannedGroup: Group[], daysBefore: number = 0, filterDifficulty: boolean = false, difficulty: number = 1, modifier: number = 0, bannedTags: string[] = [], seeded: boolean): GroupGame {
        let index: number, group: Group, i = 0;
        let groups = Constants.GROUPS;

        // if (filterDifficulty) groups = groups.filter((group: Group) => group.getDifficulty() === difficulty);
        // if (filterDifficulty) groups = groups.filter((group: Group) => group.getDifficulty() !== 3);

        do {
            if (seeded)
                index = Math.floor(Utils.getSeed(i++ + modifier, daysBefore) * groups.length);
            else
                index = Math.floor(Math.random() * groups.length);
            group = groups[index];
        } while (bannedGroup.includes(group) || bannedTags.some(tag => group.getTags().includes(tag)));

        let selectedGroup = new GroupGame(group.getName(), group.getItems(), group.getDifficulty(), group.getTags());
        return selectedGroup;
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