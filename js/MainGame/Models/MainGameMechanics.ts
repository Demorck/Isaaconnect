import { Constants } from "@/Shared/Helpers/Constants";
import { GameUtils } from "@/MainGame/Models/GameUtils";
import { Item } from "@/Shared/Models/Item";
import { Group } from "@/Shared/Models/Group";
import { GroupGame } from "@/MainGame/Models/GroupGame";
import { GameOptions } from "@/MainGame/Models/GameOptions";

export class MainGameMechanics {
    constructor() {}


    
    /**
     * @description Handle the submission of the current attempt
     *
     * @param {number[]} selectedIDs IDs of selected Items
     * @param {GroupGame[]} groups Groups of the current game
     * @param {Item[][]} history History of the game
     * @returns {({ isMessage: boolean; message: any; win?: undefined; attempts?: undefined; historyItems?: undefined; } | { win: boolean; attempts: {}; historyItems: {}; isMessage: boolean; message: any; })}
     */
    public handleSubmit = (selectedIDs: number[], groups: GroupGame[], history: Item[][], options: GameOptions) => {        
        let alreadyGuessed = this.checkIfAlreadyGuessed(history, selectedIDs, options);
        
        
        if (alreadyGuessed) {
            return { isMessage: true, message: Constants.ALREADY_GUESSED };
        }

        let currentGroup: GroupGame,
            attempts: Group[] = [],
            historyItems: Item[] = [];
            let occurrences = new Map<GroupGame, number>();

        selectedIDs.forEach(id => {
            let currentItem = GameUtils.findItemById(id);
            currentGroup = GameUtils.findGroupByItem(currentItem, groups);

            if (currentItem !== undefined) {
                occurrences.set(currentGroup, (occurrences.get(currentGroup) || 0) + 1);

                attempts.push(currentGroup);
                historyItems.push(currentItem);
            }
        });    

        let win = occurrences.size == 1;
        let almost = this.isAlmost(occurrences);

        if (almost)
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
    private checkIfAlreadyGuessed(history: Item[][], selectedIDs: number[], options: GameOptions): boolean {        
        let j = 0;
        let currentAttempt = history.length;

        history.forEach(attempt => {
            let k = 0;            
            for (let i = 0; i < options.NUMBER_OF_ITEMS; i++) {
                let filter = attempt.filter(item => item.getId() == selectedIDs[i]);
                let isInclude = filter.length > 0;
                if (isInclude) k++;
            }
            
            if (k === options.NUMBER_OF_ITEMS) j++;
        });

        const alreadyGuessed = j > 0 && currentAttempt !== 0;
           
        return alreadyGuessed;
    }

    private isAlmost(occurrences: Map<GroupGame, number>): boolean {
        let almost = false;
        occurrences.forEach((value, key) => {
            if (value == Constants.OPTIONS.NUMBER_OF_ITEMS - 1) {
                almost = true;
                return;
            }
        });

        return almost;
    }
}