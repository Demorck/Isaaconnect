import { GroupGame } from "@/MainGame/Models/GroupGame";
import { ItemController } from "@/MainGame/Controllers/ItemController";
import { GroupGameView } from "@/MainGame/Views/GroupGameView";
import { ItemView } from "@/MainGame/Views/ItemView";
import { GameOptions } from "@/MainGame/Models/GameOptions";


/**
 * Controller for the GroupGame model
 *
 * @export
 * @class GroupGameController
 * @typedef {GroupGameController}
 */
export class GroupGameController {
    private group: GroupGame;
    private groupView: GroupGameView;
    private itemsController: ItemController[];
    

    
    /**
     * Creates an instance of GroupGameController.
     *
     * @constructor
     * @param {GroupGame} group The model
     * @param {GroupGameView} groupView The view
     * @param {boolean} [blind=false] If the game is blind (for joking purposes)
     */
    constructor(group: GroupGame, groupView: GroupGameView, options: GameOptions) {
        this.group = group;
        this.groupView = groupView;
        this.itemsController = [];
        for (const item of group) {            
            let itemView = new ItemView('cards-module', item);
            this.itemsController.push(new ItemController(item, itemView, options));
        }
        

        this.group.addObserver(this.groupView);
    }

    
    /**
     * Toggle the solved state of the group and update the view
     *
     * @public
     */
    public toggleSolved(): void {
        this.group.setSolved(true, true);        
    }

    
    /**
     * Return the group name
     *
     * @public
     * @returns {string} The group name
     */
    public getGroupName(): string {
        return this.group.getName();
    }
}