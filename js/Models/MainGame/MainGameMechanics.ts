import { Constants } from "../../Helpers/Constants.js";
import { StorageManager } from "../../Helpers/Data/StorageManager.js";
import { GameUtils } from "./GameUtils.js";
import { Item } from "../Item.js";
import { Group } from "../Group.js";
import { GroupGame } from "./GroupGame.js";

export class MainGameMechanics {
    constructor() {}


    public handleSubmit = (selectedIDs: number[], groups: GroupGame[]) => {        
        let history = StorageManager.history;

        let alreadyGuessed = this.checkIfAlreadyGuessed(history, selectedIDs);
        
        if (alreadyGuessed) {
            return { isMessage: true, message: Constants.ALREADY_GUESSED };
        }

        let firstGroup: GroupGame, 
            currentGroup: GroupGame, 
            win = true,
            numberOfGroups = 0,
            attempts: Group[] = [],
            historyItems: Item[] = [];

        selectedIDs.forEach(id => {
            let currentItem = GameUtils.findItemById(id);
            currentGroup = GameUtils.findGroupByItem(currentItem, groups);

            if (currentItem !== undefined) {                
                if (!firstGroup) firstGroup = currentGroup;
                else if (firstGroup !== currentGroup) win = false;

                if (firstGroup === currentGroup) numberOfGroups++;

                attempts.push(currentGroup);
                historyItems.push(currentItem);
            }
        });

        if (numberOfGroups === Constants.NUMBER_OF_GROUPS - 1)
            return { win, numberOfGroups, attempts, historyItems, isMessage: true, message: Constants.ALMOST};

        return { win, numberOfGroups, attempts, historyItems, isMessage: false, message: ''};
    }

    private checkIfAlreadyGuessed(history: Item[][], selectedIDs: number[]) {        
        let j = 0;
        let currentAttempt = StorageManager.currentAttempt;
        history.forEach((attempt, index) => {
            let k = 0;
            for (let i = 0; i < Constants.NUMBER_OF_ITEMS; i++) {
                const currentItem = GameUtils.findItemById(selectedIDs[i]);
                let isInclude = attempt.filter(item => item.getId() === currentItem?.getId()).length > 0;
                if (isInclude) k++;
            }

            if (k === Constants.NUMBER_OF_ITEMS) j++;
        });

        const alreadyGuessed = j > 0 && currentAttempt !== 0;
        return alreadyGuessed;
    }
}