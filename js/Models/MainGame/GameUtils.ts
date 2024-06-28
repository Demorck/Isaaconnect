import { Constants } from "../../Helpers/Constants.js";
import { Utils } from "../../Helpers/Utils.js";
import { Group } from "../Group.js";
import { Item } from "../Item.js";
import { GroupGame } from "./GroupGame.js";

export class GameUtils {
    static generateSelection(daysBefore = 0, alreadyBanned = []) : Group[] {
        let bannedGroup: Group[] = alreadyBanned;
        let bannedItem: Item[] = [];

        let selectedGroups: GroupGame[] = [];
        let selectedItems: Item[] = [];


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
            } while (items === null)

            items.forEach(item => {
                selectedItems.push(item);
            });

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
}