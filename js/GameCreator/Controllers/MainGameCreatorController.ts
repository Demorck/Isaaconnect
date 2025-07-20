import {GameCreatorModel} from "@/GameCreator/Models/GameCreatorModel";
import {Constants} from "@/Shared/Helpers/Constants";
import {Item} from "@/Shared/Models/Item";
import {Utils} from "@/Shared/Helpers/Utils";

export class MainGameCreatorController {
    private add_group_button: HTMLDivElement;
    private delete_group_button: NodeListOf<HTMLDivElement>;
    private generate_permalink_button: HTMLDivElement;

    private modal_items: HTMLDivElement;


    private model: GameCreatorModel;


    private card_module: HTMLDivElement;

    constructor() {
        this.card_module = document.getElementById("cards-module") as HTMLDivElement;

        this.add_group_button = document.getElementById("add_group") as HTMLDivElement;
        this.delete_group_button = document.querySelectorAll('[data-action="delete-group"]') as NodeListOf<HTMLDivElement>;

        this.generate_permalink_button = document.getElementById("generate_permalink") as HTMLDivElement;
        this.generate_permalink_button.addEventListener("click", () => {
            if (this.generate_permalink_button.classList.contains("disabled")) {
                return;
            }
            let text = "I created a custom game in Isaaconnect, try it out here https://isaaconnect.com/custom \n"
            let a = text + this.model.generate_permalink();
            console.log(a);
            navigator.clipboard.writeText(a).then(r => {
                this.generate_permalink_button.innerText = "Permalink copied!";
                setTimeout(() => {
                    this.generate_permalink_button.innerText = "Generate permalink";
                }, 2000);
            });
        })

        this.modal_items = document.getElementById("modal-items") as HTMLDivElement;
        let hide = document.getElementById("hide-modal")!;
        hide.addEventListener("click", () => {
            if (this.modal_items.classList.contains("hidden")) {
                this.modal_items.classList.remove("hidden");
            } else {
                this.modal_items.classList.add("hidden");
            }
        })

        this.model = new GameCreatorModel();


        this.addEventListeners();
        let default_number_of_groups = this.model.number_of_group; // used to prevent recursion from the click listener
        for (let i = 0; i < default_number_of_groups; i++) {
            this.click_add_group_button(i, true);
        }

        this.populateItems();
        this.update_generate_link_button();
    }

    private addEventListeners() {
        this.add_group_button.addEventListener("click", (e) => {
            if (this.click_add_group_button())
                this.model.number_of_group++;
            this.update_generate_link_button();
        });

        this.delete_group_button.forEach((b) => {
            b.addEventListener("click", (e) => {
                this.click_delete_group(b.dataset.id!);
                this.update_generate_link_button();
            });
        });

    }


    private click_add_group_button(index_group_to_add: number = this.model.number_of_group, init: boolean = false): boolean
    {
        if (index_group_to_add >= 8)
            return false;

        for (let i = 0; i < 8; i++) {
            let selector = document.querySelector(`[data-group-index="${i}"]`);
            if (!selector)
            {
                index_group_to_add = i;
                break;
            }
        }

        let group_name = "New group " + index_group_to_add;
        let items: number[] = [];
        let get_content = (): HTMLElement => {
            let color = "";
            for (const current_color of Constants.COLORS) {
                let selector = document.querySelector(`.bg-${current_color}`);
                if (!selector)
                {
                    color = current_color;
                    break;
                }
            }

            let accent_color = Utils.get_accent_color(color);

            let s = `<section class="flex flex-1 flex-row solved-group py-3 rounded-3xl bg-${color}" data-group-index="${index_group_to_add}">
                                <div class="flex flex-1 flex-col items-start text-left">
                                    <div class="flex flex-row w-full justify-between">
                                        <h3 class="solved-group--title font-bold text-xs md:text-xl mb-2">
                                            <input class="rounded-full bg-${accent_color}/70 border-${accent_color} border-4 px-4" type="text" name="input-${index_group_to_add}" id="input-${index_group_to_add}" placeholder="Name of the group" value="${group_name}" data-last-name="${group_name}">
                                        </h3>
                                        <div class="w-12 scale-75 bg-${accent_color}/70 rounded-full flex items-center justify-center aspect-square cursor-pointer" data-id="${index_group_to_add}" data-action="delete-group">
                                                ✖
                                        </div>
                                    </div>
                                    <div class="flex flex-row flex-wrap sm:flex-nowrap items-center" data-action="group-items">
                                    </div>
                                </div>
                            </section>`;

            let temp = document.createElement("div");
            temp.innerHTML = s;

            let button = temp.querySelector('[data-action="delete-group"]')! as HTMLDivElement;
            button.addEventListener('click', (e) => {
                this.click_delete_group(button.dataset.id!)
                this.update_generate_link_button();
            });

            let input = temp.querySelector('input')!;

            input.addEventListener("input", (e) => {
                let el = e.target as HTMLInputElement;
                let value = el.value;
                this.model.modify_name(index_group_to_add, value);
            })

            let items_element = temp.querySelector('[data-action="group-items"]')! as HTMLDivElement;

            let number_of_items = init ? 4 : this.model.group_max_items();
            for (let i = 0; i < number_of_items; i++) {
                let id = this.get_random_id();
                items.push(id);
                items_element.appendChild(this.get_element_item(id, index_group_to_add));
            }

            if (number_of_items < 8)
                items_element.appendChild(this.get_element_new_item(index_group_to_add));

            return temp.firstElementChild as HTMLElement;
        }

        this.card_module.appendChild(get_content());
        this.model.add_group(group_name, index_group_to_add);
        this.model.add_items_in_group(index_group_to_add, items);
        this.update_generate_link_button();
        return true;
    }

    private click_delete_group(id: string)
    {
        let el = document.querySelector('[data-group-index="' + id + '"]');
        if (el) {
            let parent = el.parentElement;
            if (parent) parent.removeChild(el);
            this.model.number_of_group--;
        }

        this.model.remove_group(parseInt(id));

        this.update_generate_link_button();
    }

    private click_add_item_button(group_id: number)
    {
        let group = document.querySelector('[data-group-index="' + group_id + '"] [data-action="group-items"]')! as HTMLDivElement;
        let id = this.get_random_id();
        let new_element = this.get_element_item(id, group_id);
        group.removeChild(group.lastChild!);
        group.appendChild(new_element);
        if (this.model.number_items_of_group(group_id) < 7)
            group.appendChild(this.get_element_new_item(group_id));

        this.model.push_item_in_group(group_id, id)
        this.update_generate_link_button();

        return true;
    }


    private get_element_item(id: number, group: number): HTMLElement
    {
        let item;
        item = Constants.ITEMS.find((item) => item.getId() == id);
        if (item == undefined)
            item = Constants.ITEMS[id];

        let color = Utils.get_accent_color(Constants.COLORS[group]);

        let string_element = `
            <label class="card-module flex-col aspect-square feur relative rounded-xl" data-id="${id}" style="background-color: rgb(229 221 235 / 0.4);">
                <input id="card-90" type="checkbox" class="visually-hidden">
                <img class="" src="${item.getImage()}" alt="${item.getAlias()}">
                <span class="card-module--content text-xs sm:text-sm text-wrap">${item.getAlias()}</span>
                <div class="w-6 sm:w-8 scale-75 bg-${color}/70 top-0 right-0 rounded-full text-center absolute aspect-square cursor-pointer" data-action="delete-item">
                    ✖
                </div>
            </label>`
        let temp = document.createElement("div");
        temp.innerHTML = string_element;
        let element = temp.firstElementChild as HTMLElement;
        element.addEventListener("click", (e) => {
            this.modal_items.dataset.groupId = group.toString();
            this.modal_items.dataset.itemId = id.toString();
            this.modal_items.classList.remove("hidden");
        })

        let delete_button = element.querySelector('[data-action="delete-item"]') as HTMLDivElement;
        delete_button.addEventListener("click", (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();
            element.remove();
            let group_element = document.querySelector('[data-group-index="' + group + '"] [data-action="group-items"]')! as HTMLDivElement;
            if (this.model.number_items_of_group(group) == 8) {
                group_element.appendChild(this.get_element_new_item(group));
            }

            this.model.remove_item_from_group(group, id);
            this.update_generate_link_button();
        })

        return element;
    }

    private get_element_new_item(group: number): HTMLElement
    {

        let color = Utils.get_accent_color(Constants.COLORS[group]);

        let string_element = `
            <label class="h-3/4 bg-[#e5ddeb75]/40 p-4 sm:p-6 aspect-square flex items-center justify-center text-${color} text-3xl sm:text-6xl rounded-xl cursor-pointer">
                +
            </label>`

        let temp = document.createElement("div");
        temp.innerHTML = string_element;
        let element = temp.firstElementChild as HTMLElement;

        element.addEventListener("click", (e) => {
            this.click_add_item_button(group);
            this.update_generate_link_button();
        });

        return element;
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


    private populateItems(): void {
        let itemsWrapper = document.getElementById('items')!;
        Constants.ITEMS.forEach(item => {
            let element = MainGameCreatorController.createItemElement(item);
            element.addEventListener('click', () => {
                let group_id = this.modal_items.dataset.groupId!;
                let name_id = this.modal_items.dataset.itemId!;
                this.model.change_item_id(parseInt(group_id), parseInt(name_id), item.getId());

                let group_query = document.querySelector('[data-group-index="' + group_id + '"]')!;
                let items_query = group_query.querySelector('[data-id="' + name_id + '"]')!;
                let new_element = this.get_element_item(item.getId(), parseInt(group_id));
                items_query.replaceWith(new_element);
                this.modal_items.classList.add("hidden");
            });
            itemsWrapper.appendChild(element);
        });
    }

    private static createItemElement(item: Item): HTMLElement {
        const showItemInfo = (element: HTMLDivElement, item: Item) => {
            let wrapper = document.querySelector('.infos')!;
            wrapper.innerHTML = '';
            wrapper.classList.remove('hidden');
            const children = document.createElement('div');
            children.innerHTML = `<p>ID: ${item.getId()}</p><p>Nom: ${item.getAlias()}</p>`;
            wrapper.appendChild(children);
        };
        const hideItemInfo = (element: HTMLElement, item: Item) => {
            let wrapper = document.querySelector('.infos')!;
            wrapper.classList.add('hidden');
        };

        let itemElement = document.createElement('div');
        itemElement.classList.add('item', 'cursor-pointer');
        itemElement.dataset.id = item.getId().toString();
        itemElement.innerHTML = `<img width="64px" class="pixelated" src="${item.getImage()}" alt="${item.getAlias()}">`;
        itemElement.addEventListener('mouseover', showItemInfo.bind(this, itemElement, item));
        itemElement.addEventListener('mouseout', hideItemInfo.bind(this, itemElement, item));
        return itemElement;
    }

    private update_generate_link_button() {
        let string = "";

        if (!this.model.is_groups_has_same_number_of_items()) {
            string += "All groups must have the same number of items.\n";
        }

        if (!this.model.has_minimum_two_groups()) {
            string += "You must have at least two groups.\n";
        }

        if (!this.model.has_minimum_two_items()) {
            string += "You must have at least two items in each group.\n";
        }

        this.generate_permalink_button.innerText =  string ? string : "Generate permalink";

        if (string != "") {
            this.generate_permalink_button.classList.remove("cursor-pointer");
            this.generate_permalink_button.classList.add("disabled", "text-sm");
        } else {
            this.generate_permalink_button.classList.add("cursor-pointer");
            this.generate_permalink_button.classList.remove("disabled", "text-sm");
        }
    }
}