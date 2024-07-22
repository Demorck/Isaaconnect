import { GroupGame } from "../Models/GroupGame.js";
import { ItemController } from "./ItemController.js";
import { GroupGameView } from "../Views/GroupGameView.js";
import { ItemView } from "../Views/ItemView.js";
import { Constants } from "../../Shared/Helpers/Constants.js";


export class GroupGameController {
    private group: GroupGame;
    private groupView: GroupGameView;
    private itemsController: ItemController[] = [];

    constructor(group: GroupGame, groupView: GroupGameView, blind: boolean = false) {
        this.group = group;
        this.groupView = groupView;
        for (const item of group) {
            let itemView = new ItemView('cards-module', item, blind);
            this.itemsController.push(new ItemController(item, itemView));
        }

        this.group.addObserver(this.groupView);
    }

    public getItemElement(index: number): HTMLElement {
        return this.itemsController[index % Constants.NUMBER_OF_ITEMS].getItemElement();
    }

    public toggleSolved(): void {
        this.group.setSolved(true, true);        
    }

    public getGroupName(): string {
        return this.group.getName();
    }
}