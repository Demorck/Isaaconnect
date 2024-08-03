import { Constants } from "../Helpers/Constants.js";
import { ItemData } from "../Helpers/Data/ItemData.js";
import { Observable } from "./Observable.js";

export class Item extends Observable {
    private id: number;
    private alias_en: string;
    private alias_fr: string;
    private blinded: boolean = false;
    private imagePath: string;


    constructor(id: number, alias: string, image: string) {
        super();
        this.id = id;
        this.alias_en = alias;
        this.alias_fr = alias;
        this.imagePath = image;        
    }

    public getId(): number {
        return this.id;
    }

    public getAlias(): string {
        return this.alias_en;
    }

    public getImage(): string {
        return this.imagePath;
    }

    public getData(): ItemData {
        return {
            id: this.id,
            name: this.alias_en
        };
    }

    private getAliasFromId(id: number): string {
        let alias = '';
        
        Constants.ITEMS?.forEach(item => {
            if (item.id === id) {
                alias = item.getAlias();
            }
        });
        return alias;
    }

    public wrongAnswer(): void {
        this.notifyObservers({ shake: true });
    }

    public setBlind(isBlind: boolean): void {
        this.blinded = isBlind;
    }

    public isBlind(): boolean {
        return this.blinded;
    }
}