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

    constructor() {
        super();
        this.health = Constants.MAX_HEALTH;
        this.attempts = [];
        this.history = [];
        this.currentAttempt = 0;
        this.groups = [];
        this.setupGame();
    }

    private setupGame() : void {
        const lastIsaaconnect = StorageManager.lastIsaaconnect;
        if(lastIsaaconnect !== Utils.getDaysSince())
            StorageManager.newIsaaconnect();


        let bannedGroups: Group[];
        for (let i = 1; i <= Constants.NUMBER_OF_GROUPS; i++) {
            const selectedGroups = GameUtils.generateSelection(i);
            console.log(selectedGroups);
            
        }
    }

    // private generateGroups(numberOfGroups: number): Group[] {
}