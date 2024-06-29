import { Constants } from "../../Helpers/Constants.js";
import { StorageManager } from "../../Helpers/Data/StorageManager.js";
import { Utils } from "../../Helpers/Utils.js";
import { Observable } from "../Observable.js";
import { GroupGame } from "./GroupGame.js";
import { Group } from "../Group.js";
import { GameUtils } from "./GameUtils.js";

export class MainGame extends Observable {
    private health: number;
    private groups: GroupGame[];
    private attempts: [];
    private history: [];
    private currentAttempt: number;
    private itemsIndex: number[];

    constructor() {
        super();
        this.health = Constants.MAX_HEALTH;
        this.attempts = [];
        this.history = [];
        this.currentAttempt = 0;
        this.groups = [];
        this.itemsIndex = [];
        for (let i = 0; i < Constants.NUMBER_OF_GROUPS * Constants.NUMBER_OF_ITEMS; i++) {
            this.itemsIndex.push(i);
        }
        this.itemsIndex = Utils.shuffleArray(this.itemsIndex);
        this.setupGame();
    }

    private setupGame() : void {
        const lastIsaaconnect = StorageManager.lastIsaaconnect;
        if(lastIsaaconnect !== Utils.getDaysSince())
            StorageManager.newIsaaconnect();

        let bannedGroups: Group[] = [];
        for (let i = 1; i <= Constants.NUMBER_OF_DAYS_BEFORE; i++) {
            const selectedGroups = GameUtils.generateSelection(i);
            selectedGroups.forEach(group => bannedGroups.indexOf(group) === -1 ? bannedGroups.push(group) : null);
        }

        this.groups = GameUtils.generateSelection(0, bannedGroups);
        
        
    }

    public getGroups(): GroupGame[] {
        return this.groups.slice();
    }

    // private generateGroups(numberOfGroups: number): Group[] {
}