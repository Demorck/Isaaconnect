import { Item } from "../../Shared/Models/Item.js";
import { GameUtils } from "../../MainGame/Models/GameUtils.js";

export class Stats {
    private _occurenceGroup: Map<string, number>;
    private _numberOfGeneration: number;
    private _numberCalled: number;
    private _impossibleGridFound: number;

    constructor(numberOfGeneration: number) {
        this._occurenceGroup = new Map<string, number>();
        this._numberOfGeneration = numberOfGeneration;
        this._numberCalled = 0;
        this._impossibleGridFound = 0;
    }

    public generateOccurenceGroup(): void {
        for (let i = 0; i < this._numberOfGeneration; i++) {
            let groups = GameUtils.generateSelection(0, [], false);  
            let items: Item[] = [];
            groups.forEach(group => {
                items.push(...group.getSelectedItems());
            });
            
            let { impossible, itemsNotInGroup } = GameUtils.checkGrid(groups, items);
            if (impossible) {
                this._impossibleGridFound++;
            }
            // while (impossible) {
            //     this._impossibleGridFound++;
            //     console.log("Impossible grid found: ");
            //     console.log(groups);
            //     console.log(itemsNotInGroup);

                
                
            //     let group;
            //     itemsNotInGroup.forEach(item => {
            //         group = groups.find(group => group.isItemInGroup(item));
            //         console.log(group);
                    
                    
            //     });
            //     impossible = false;
            // }
            

            groups.forEach(group => {
                let occurence = this._occurenceGroup.get(group.getName());
                if (occurence) {
                    this._occurenceGroup.set(group.getName(), occurence + 1);
                } else {
                    this._occurenceGroup.set(group.getName(), 1);
                }
            });
            this._numberCalled++;
        }
    }

    public getOccurenceGroup(): Map<string, number> {
        return this._occurenceGroup;
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
}