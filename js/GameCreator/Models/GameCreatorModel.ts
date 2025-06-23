import {Constants} from "@/Shared/Helpers/Constants";
import {encodeOptions, Options, toBase64url} from "@/Shared/Helpers/Permalink";

type Item = {
    id: number;
}

type Group = {
    internal_id: number,
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

    public add_group(name: string, id: number) {
        let group: Group = {
            internal_id: id,
            name: name,
            items: []
        }

        this.groups.push(group);
    }

    public remove_group(id: number) {
        let idx = this.find_group_index_by_id(id);
        if (idx != undefined) {
            this.groups.splice(idx, 1);
        }
    }

    public modify_name(id: number, new_name: string) {
        let idx = this.find_group_index_by_id(id);
        if (idx != undefined) {
            this.groups[idx].name = new_name;
            console.log(this.groups);
        } else {
            console.error("Group not found in modify_name: \n" +
                            "\tidx: " + idx +
                            "\n\tnew_name: " + new_name +
                            "\n\tgroups: ");
            console.log(this.groups)
        }
    }

    public add_items_in_group(id: number, items: number[]) {
        let idx = this.find_group_index_by_id(id);
        if (idx != undefined) {
            for (let i = 0; i < items.length; i++) {
                let item_id = items[i];
                let item: Item = {
                    id: item_id,
                }

                this.groups[idx].items.push(item);
            }
        }
    }

    public push_item_in_group(id: number, item_id: number) {
        let idx = this.find_group_index_by_id(id);
        if (idx != undefined) {
            let item: Item = {
                id: item_id
            }
            this.groups[idx].items.push(item);
        }
    }

    public change_item_id(group_id: number, last_id: number, new_id: number) {
        let idx = this.find_group_index_by_id(group_id);
        if (idx != undefined) {
            let group = this.groups[idx];
            for (let i = 0; i < group.items.length; i++) {
                let item = group.items[i];
                if (item.id == last_id) {
                    item.id = new_id;
                    break;
                }
            }
        }
    }

    public remove_last_item(id: number)
    {
        let idx = this.find_group_index_by_id(id);
        if (idx != undefined) {
            this.groups[idx].items.pop();
        }
    }

    private find_group_index_by_id(id: number)
    {
        let groups = this.groups.filter(group => group.internal_id === id);
        if (groups.length == 0 || groups.length > 1)
            return; // throw error

        let group_found = groups[0];

        return this.groups.indexOf(group_found);
    }

    public generate_permalink(): string {
        let options : Options = {
            health: 4,
            enabled_blind: false,
            numer_blind: 0,
            count_names: this.number_of_group,
            count_ids: this.number_of_items,
            names: [],
            ids: []
        }

        this.groups.forEach((group) => {
            let name = group.name;
            let items = group.items.map((item) => item.id)
            options.names.push(name);
            options.ids.push(...items);
        });

        return toBase64url(encodeOptions(options));
    }
}