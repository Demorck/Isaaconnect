import { Constants } from "../Helpers/Constants.js";
import { Observable } from "./Observable.js";

export class Item extends Observable {
    private id: number;
    private alias_en: string;
    private alias_fr: string;


    constructor(id: number, alias: string) {
        super();
        this.id = id;
        this.alias_en = alias;
        this.alias_fr = alias;
    }

    public getId(): number {
        return this.id;
    }

    public getAlias(): string {
        return this.alias_en;
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
}