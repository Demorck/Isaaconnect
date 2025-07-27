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
    private _options: Options;

    constructor() {
        this._number_of_group = 2;
        this.groups = [];
        this._options = {
            health: 4,
            enabled_blind: false,
            numer_blind: 0,
            count_names: this._number_of_group,
            count_ids: 4,
            names: [],
            ids: []
        };
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

    public set_health(health: number) {
        if (health < 1 || health > 8) {
            console.error("Health must be between 1 and 8.");
            return;
        }
        this._options.health = health;
    }

    private find_group_index_by_id(id: number)
    {
        let groups = this.groups.filter(group => group.internal_id === id);
        if (groups.length == 0 || groups.length > 1)
            return; // throw error

        let group_found = groups[0];

        return this.groups.indexOf(group_found);
    }

    public all_id_is_unique(): boolean {
        let all_ids: number[] = [];
        for (let group of this.groups) {
            for (let item of group.items) {
                if (all_ids.includes(item.id)) {
                    return false;
                }
                all_ids.push(item.id);
            }
        }

        return true;
    }

    public all_group_name_is_different(): boolean {
        if (this.groups.length === 0) {
            return true;
        }

        let group_names = this.groups.map(group => group.name);
        let unique_names = new Set(group_names);

        return unique_names.size == group_names.length;
    }

    public is_one_group_name_empty(): boolean {
        for (let group of this.groups) {
            if (group.name.trim() === "") {
                return true;
            }
        }
        return false;
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

        this._options.count_ids = this.group_max_items();
        this._options.count_names = this.groups.length;
        this._options.enabled_blind = false; // Currently not used, but can be set later
        this._options.numer_blind = 0; // Currently not used, but can be set later
        this._options.ids = [];
        this._options.names = [];

        this.groups.forEach((group) => {
            let name = group.name;
            let items = group.items.map((item) => item.id)
            this._options.names.push(name);
            this._options.ids.push(...items);
        });

        return toBase64url(encodeOptions(this._options));
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