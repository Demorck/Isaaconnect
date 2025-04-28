type Item = {
    id: number;
}

type Group = {
    name: string,
    items: Item[],
}

export class GameCreatorModel {
    private number_of_group: number;
    private number_of_items: number;

    private groups: Group[];

    constructor() {
        this.number_of_group = 4;
        this.number_of_items = 4;
        this.groups = [];
    }

}