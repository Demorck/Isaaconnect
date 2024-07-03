import { Constants } from "../../Helpers/Constants.js";
import { Utils } from "../../Helpers/Utils.js";
import { Group } from "../Group.js";
import { Item } from "../Item.js";
import { GroupGame } from "./GroupGame.js";

export class GameUtils {
    static generateSelection(daysBefore = 0, alreadyBanned: Group[] = []) : GroupGame[] {
        let bannedGroup: Group[] = alreadyBanned;
        let bannedItem: Item[] = [];

        let selectedGroups: GroupGame[] = [];

        for (let i = 0; i < Constants.NUMBER_OF_GROUPS; i++) {
            let currentGroup;
            currentGroup = GameUtils.getRandomGroup(bannedGroup, daysBefore, true, i);
            selectedGroups.push(currentGroup);
            bannedGroup.push(currentGroup);

            let items: Item[] | null;
            do {
                items = currentGroup.getRandomItems(bannedItem, daysBefore);
                if (items === null) {
                    selectedGroups.pop();
                    currentGroup = GameUtils.getRandomGroup(bannedGroup, daysBefore, true, i, 1);
                    selectedGroups.push(currentGroup);
                    bannedGroup.push(currentGroup);
                }                
            } while (items === null);


            currentGroup.setIndex(i);
            currentGroup.getItems().forEach(item => {
                if (bannedItem.indexOf(item) === -1) {
                    bannedItem.push(item);
                }

                Constants.GROUPS.forEach(group => {
                    if (group.getItems().indexOf(item) !== -1) {
                        bannedGroup.push(group);
                    }
                });
            });
        }

        return selectedGroups;
    }

    static getRandomGroup(bannedGroup: Group[], daysBefore: number = 0, filterDifficulty: boolean = false, difficulty: number = 1, modifier: number = 0): GroupGame {
        let index: number, group: Group, i = 0;
        let groups = Constants.GROUPS;

        if (filterDifficulty) groups = groups.filter((group: Group) => group.getDifficulty() === difficulty);

        do {
            index = Math.floor(Utils.getSeed(i++ + modifier, daysBefore) * groups.length);
            group = groups[index];
        } while (bannedGroup.includes(group));

        return new GroupGame(group.getName(), group.getItems(), group.getDifficulty());
    }

    /**
     * Find an item froms items.json by its id
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