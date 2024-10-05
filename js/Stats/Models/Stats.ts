import { Item } from "../../Shared/Models/Item.js";
import { GameUtils } from "../../MainGame/Models/GameUtils.js";
import { GameOptions } from "../../MainGame/Models/GameOptions.js";
import { Difficulties } from "../../Shared/Models/Enums/Difficulties.js";
import { Constants } from "../../Shared/Helpers/Constants.js";
import { GroupGame } from "../../MainGame/Models/GroupGame.js";

export class Stats {
    private _occurenceGroup: Map<string, number>;
    private _difficultyOccurence: Map<Difficulties, number>;
    private _numberOfGeneration: number;
    private _numberCalled: number;
    private _impossibleGridFound: number;
    private _gameUtils: GameUtils;
    private _options: GameOptions;

    constructor(numberOfGeneration: number) {
        this._occurenceGroup = new Map<string, number>();
        this._difficultyOccurence = new Map<Difficulties, number>();
        this._numberOfGeneration = numberOfGeneration;
        this._numberCalled = 0;
        this._impossibleGridFound = 0;
        this._options = this.generateOptions();
        this._gameUtils = new GameUtils(this._options);
        Constants.OPTIONS = this._options;
    }

    public generateOccurenceGroup(): void {
        // let bannedGroups: GroupGame[] = [];
        // for (let i = 1; i <= Constants.NUMBER_OF_DAYS_BEFORE; i++) {
        //     const selectedGroups = this._gameUtils.whileSelection(i);
        //     selectedGroups.forEach(group => bannedGroups.indexOf(group) === -1 ? bannedGroups.push(group) : null);
        // }


        for (let i = 0; i < this._numberOfGeneration; i++) {
            let banned: GroupGame[] = [];
            let groups = this._gameUtils.whileSelection(0, banned);  
            let items: Item[] = [];
            groups.forEach(group => {
                items.push(...group.getSelectedItems());
            });
            
            let { impossible, itemsNotInGroup } = this._gameUtils.checkGrid(groups, items);
            if (impossible) {
                this._impossibleGridFound++;
            }

            groups.forEach(group => {
                let occurence = this._occurenceGroup.get(group.getName());
                if (occurence) {
                    this._occurenceGroup.set(group.getName(), occurence + 1);
                } else {
                    this._occurenceGroup.set(group.getName(), 1);
                }
                this._difficultyOccurence.set(group.getDifficulty(), (this._difficultyOccurence.get(group.getDifficulty()) || 0) + 1);
            });
            this._numberCalled++;
        }
    }

    public getOccurenceGroup(): Map<string, number> {
        return this._occurenceGroup;
    }

    public getDifficultyOccurence(): Map<Difficulties, number> {
        return this._difficultyOccurence;
    }

    public getTotalOccurence(): number {
        let total = 0;
        for (let value of this._occurenceGroup.values()) {
            total += value;
        }
        return total;
    }

    public getNumberOfImpossibleGridFound(): number {
        return this._impossibleGridFound;
    }

    public getNumberOfGameCalled(): number {
        return this._numberCalled;
    }

    public generateOptions(): GameOptions {
        return {
            NUMBER_OF_GROUPS: 4,
            NUMBER_OF_ITEMS: 4,
            SEEDED: false,
            HEALTH: 4,
            NUMBER_OF_BLIND_ITEMS: 0,
            TAGS_BANNED: true,
            CUSTOM_DIFFICULTY: Difficulties.NORMAL,
            CHECK_GRID: true,
        }
    }
}