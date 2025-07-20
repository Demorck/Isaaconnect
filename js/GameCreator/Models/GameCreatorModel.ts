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

    private readonly groups: Group[];

    constructor() {
        this._number_of_group = 2;
        this.groups = [];
    }


    get number_of_group(): number {
        return this._number_of_group;
    }

    set number_of_group(value: number) {
        this._number_of_group = value;
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

    public is_groups_has_same_number_of_items(): boolean {
        let first_group = this.groups[0];
        let length = first_group.items.length;
        for (let group of this.groups) {
            if (group.items.length !== length) {
                return false;
            }
        }

        return true;
    }

    public has_minimum_two_groups(): boolean {
        return this.groups.length >= 2;
    }

    public has_minimum_two_items(): boolean {
        if (this.groups.length === 0) {
            return false;
        }

        for (let group of this.groups) {
            if (group.items.length < 2) {
                return false;
            }
        }

        return true;
    }

    public group_max_items(): number {
        if (this.groups.length === 0) {
            return 0;
        }

        let max_items = this.groups[0].items.length;
        for (let group of this.groups) {
            if (group.items.length > max_items) {
                max_items = group.items.length;
            }
        }

        return max_items;
    }
// BAAABAU-SXRlbXMgd2hlcmUgdGhlIGlkIGNvbnNpc3RzIG9mIGEgc2luZ2xlIGRpZ2l0IHJlcGVhdGVkIDMgdGltZXMRU3ByaXRlIHdpdGggYSBmbHkcU3ByaXRlIHdpdGggY2VudHJhbCBzeW1tZXRyeQtTQVVDSVNTRVMgIQBvAN4BTQG8AisAFgAYAIECOgK1AhABeAGIAYoATwKdAp0CnQKdAp0
    public generate_permalink(): string {
        if (!this.is_groups_has_same_number_of_items()) {
            console.error("Groups do not have the same number of items.");
            return "";
        }

        let options : Options = {
            health: 4,
            enabled_blind: false,
            numer_blind: 0,
            count_names: this.number_of_group,
            count_ids: this.groups[0].items.length,
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

    public number_items_of_group(group_id: number) {
        let idx = this.find_group_index_by_id(group_id);
        if (idx != undefined) {
            return this.groups[idx].items.length;
        } else {
            console.error("Group not found in number_items_of_group: \n" +
                            "\tgroup_id: " + group_id +
                            "\n\tgroups: ");
            console.log(this.groups);
            return 0;
        }

    }

    private get_random_id()
    {
        let id = -2, item;
        while (id == -2)
        {
            let rng = Math.floor(Math.random() * Constants.ITEMS.length);
            item = Constants.ITEMS[rng];
            if (item)
                id = rng;
        }

        return id;
    }

    public remove_item_from_group(group: number, id: number) {
        let idx = this.find_group_index_by_id(group);
        if (idx != undefined) {
            let items = this.groups[idx].items;
            let itemIndex = items.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                items.splice(itemIndex, 1);
            } else {
                console.error(`Item with id ${id} not found in group ${group}`);
            }
        } else {
            console.error(`Group with id ${group} not found`);
        }

    }
}