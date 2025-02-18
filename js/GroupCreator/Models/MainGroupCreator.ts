import { Observable } from "@/Shared/Models/Observable";
import { Group } from "@/Shared/Models/Group";
import { GroupJSONData } from "@/Shared/Helpers/Data/GroupData";

export class MainGroupCreator extends Observable {
    private groups: Group[];


    constructor() {
        super();
        this.groups = [];
    }

    public addGroup(group: Group): void {
        this.groups.push(group);
        this.notifyObservers();
    }

    public removeGroup(group: Group): void {    
        let index = this.groups.indexOf(group);
        this.groups.splice(index, 1);
        this.notifyObservers({remove: group});
    }

    public generate(): void {
        let groups: GroupJSONData[] = [];
        let canGenerate = true;
        let groupError: string[] = [];
        this.groups.forEach(group => {
            let items: number[] = [];
            if (group.getItems().length < 2) {
                canGenerate = false;
                groupError.push(group.getName());
            }

            if (!canGenerate) return;

            for (const item of group)
                items.push(item.getId());

            groups.push({
                name: group.getName(),
                items: items,
                difficulty: group.getDifficulty(),
                tags: group.getTags()
            });
        });

        if (!canGenerate) {
            this.notifyObservers({error: 'Not enough items in group: ' + groupError.join(', ')});
            return;
        }

        let data = JSON.stringify(groups, null, 2);
        data = data.replace(/^\s*([0-9]*,?)*\n/gm, '$1 ')
                    .replace(/^\s*([\"\w\"]*,?)*\n/gm, '$1 ')
                    .replace(/(: \[)\n/gm, '$1')
                    .replace(/(     ])/gm, ']')
                    .replace(/(    ])/gm, ']');

        this.notifyObservers({data: data});
    }
}