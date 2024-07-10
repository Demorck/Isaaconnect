import { Observable } from "../Observable.js";
import { Group } from "../Group.js";

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
}