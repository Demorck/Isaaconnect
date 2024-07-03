import { GroupData } from "../Helpers/Data/GroupData.js";
import { Item } from "./Item.js";
import { GroupGame } from "./MainGame/GroupGame.js";
import { Observable } from "./Observable.js";

export class Group extends Observable implements Iterable<Item> {
    private name: string;
    private items: Item[];
    private difficulty: number;

    constructor(name: string, items: Item[], difficulty: number) {
        super();
        this.name = name;
        this.items = items;
        this.difficulty = difficulty;
    }

    public getName(): string {
        return this.name;
    }

    public getItems(): Item[] {
        return this.items;
    }

    public getDifficulty(): number {
        return this.difficulty;
    }

    public getData(): GroupData {
        return {
            name: this.getName(),
            items: this.items.map(item => item.getData()),
            difficulty: this.getDifficulty(),
            index: 0
        };
    }

    public [Symbol.iterator](): Iterator<Item> {
        let index = 0;
        return {
            next: () => {
                if (index < this.items.length) {
                    return {
                        done: false,
                        value: this.items[index++]
                    };
                } else {
                    return {
                        done: true,
                        value: null
                    };
                }
            }
        };
    }
}