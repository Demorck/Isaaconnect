import { Constants } from "../../Shared/Helpers/Constants.js";
import { StorageManager } from "../../Shared/Helpers/Data/StorageManager.js";
import { GameUtils } from "./GameUtils.js";
import { Item } from "../../Shared/Models/Item.js";
import { Group } from "../../Shared/Models/Group.js";
import { GroupGame } from "./GroupGame.js";

export class MainGameMechanics {
    constructor() {}


    public handleSubmit = (selectedIDs: number[], groups: GroupGame[], history: Item[][]) => {        
        let alreadyGuessed = this.checkIfAlreadyGuessed(history, selectedIDs);
        
        if (alreadyGuessed) {
            return { isMessage: true, message: Constants.ALREADY_GUESSED };
        }

        let firstGroup: GroupGame, 
            currentGroup: GroupGame, 
            win = true,
            numberOfItemsCorrect = 0,
            attempts: Group[] = [],
            historyItems: Item[] = [];

        selectedIDs.forEach(id => {
            let currentItem = GameUtils.findItemById(id);
            currentGroup = GameUtils.findGroupByItem(currentItem, groups);

            if (currentItem !== undefined) {                
                if (!firstGroup) firstGroup = currentGroup;
                else if (firstGroup !== currentGroup) win = false;

                if (firstGroup === currentGroup) numberOfItemsCorrect++;

                attempts.push(currentGroup);
                historyItems.push(currentItem);
            }
        });

        if (numberOfItemsCorrect === Constants.NUMBER_OF_ITEMS - 1)
            return { win, attempts, historyItems, isMessage: true, message: Constants.ALMOST};

        return { win, attempts, historyItems, isMessage: false, message: ''};
    }
    
    /**
     * @description Check if the current attempt has already been guessed
     *
     * @private
     * @param {{id: number}[][]} history J'aime pas comment c'est fait ça
     * @param {number[]} selectedIDs IDs of selected Items 
     * @returns {boolean}
     */
    private checkIfAlreadyGuessed(history: Item[][], selectedIDs: number[]): boolean {        
        let j = 0;
        let currentAttempt = history.length;
        history.forEach(attempt => {
            let k = 0;            
            for (let i = 0; i < Constants.NUMBER_OF_ITEMS; i++) {
                let filter = attempt.filter(item => item.getId() == selectedIDs[i]);
                let isInclude = filter.length > 0;
                if (isInclude) k++;
            }
            
            if (k === Constants.NUMBER_OF_ITEMS) j++;
        });

        const alreadyGuessed = j > 0 && currentAttempt !== 0;
           
        return alreadyGuessed;
    }
}