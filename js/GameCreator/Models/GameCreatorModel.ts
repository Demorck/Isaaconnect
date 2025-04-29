type Item = {
    id: number;
}

type Group = {
    name: string,
    items: Item[],
}

export class GameCreatorModel {
    private _number_of_group: number;
    private _number_of_items: number;

    private groups: Group[];

    constructor() {
        this._number_of_group = 2;
        this._number_of_items = 4;
        this.groups = [];
    }


    get number_of_group(): number {
        return this._number_of_group;
    }

    set number_of_group(value: number) {
        this._number_of_group = value;
    }

    get number_of_items(): number {
        return this._number_of_items;
    }

    set number_of_items(value: number) {
        this._number_of_items = value;
    }
}