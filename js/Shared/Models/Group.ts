import { GroupData } from "../Helpers/Data/GroupData.js";
import { Item } from "./Item.js";
import { Observable } from "./Observable.js";

export class Group extends Observable implements Iterable<Item> {
    private name: string;
    private items: Item[];
    private difficulty: number;
    private tags: string[];

    constructor(name: string, items: Item[], difficulty: number, tags: string[] | undefined) {
        super();
        this.name = name;
        this.items = items;
        this.difficulty = difficulty;
        this.tags = tags ? tags : [];
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
        this.notifyObservers();
    }

    public addItem(item: Item): void {
        if (this.items.includes(item)) {
            return;
        }
        this.items.push(item);
        this.notifyObservers();
    }

    public removeItem(item: Item): void {
        let index = this.items.indexOf(item);
        this.items.splice(index, 1);
        this.notifyObservers();
    }

    public hasItem(item: Item): boolean {
        return this.items.includes(item);
    }

    public getItems(): Item[] {
        return this.items;
    }

    public setDifficulty(difficulty: number): void {
        this.difficulty = difficulty;
        this.notifyObservers({ difficulty: difficulty });
    }

    public getTags(): string[] {
        return this.tags;
    }

    public addTags(tag: string[]): void {
        this.tags.push(...tag);
    }
    public addTag(tag: string): void {
        if (this.tags.includes(tag)) {
            return;
        }
        this.tags.push(tag);
    }

    public getDifficulty(): number {
        return this.difficulty;
    }

    public getData(): GroupData {
        return {
            name: this.getName(),
            items: this.items.map(item => item.getData()),
            difficulty: this.getDifficulty(),
            tags: this.getTags(),
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