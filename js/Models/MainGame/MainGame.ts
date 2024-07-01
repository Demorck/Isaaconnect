import { Constants } from "../../Helpers/Constants.js";
import { StorageManager } from "../../Helpers/Data/StorageManager.js";
import { Utils } from "../../Helpers/Utils.js";
import { Observable } from "../Observable.js";
import { GroupGame } from "./GroupGame.js";
import { Group } from "../Group.js";
import { GameUtils } from "./GameUtils.js";
import { MainGameMechanics } from "./MainGameMechanics.js";

export class MainGame extends Observable {
    private health: number;
    private groups: GroupGame[];
    private attempts: [];
    private history: [];
    private currentAttempt: number;

    private mechanics: MainGameMechanics;

    constructor() {
        super();
        this.health = Constants.MAX_HEALTH;
        this.attempts = [];
        this.history = [];
        this.currentAttempt = 0;
        this.groups = [];
        this.mechanics = new MainGameMechanics();
        
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

    public handleSubmit(selectedID: number[]) {
        let results = this.mechanics.handleSubmit(selectedID, this.getGroups());
        
        let win = results.win;
        let numberOfGroups = results.numberOfGroups;
        let attempts = results.attempts;
        let historyItems = results.historyItems;
        let isMessage = results.isMessage;
        let message = results.message;

        if (isMessage) {
            this.notifyObservers({ isMessage, message });
            return;
        }
    }

}