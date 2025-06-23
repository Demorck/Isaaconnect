import {GameCreatorModel} from "@/GameCreator/Models/GameCreatorModel";
import {Constants} from "@/Shared/Helpers/Constants";
import {Item} from "@/Shared/Models/Item";
import {Utils} from "@/Shared/Helpers/Utils";
import {MainGroupCreatorController} from "@/GroupCreator/Controllers/MainGroupCreatorController";

export class MainGameCreatorController {
    private add_group_button: HTMLDivElement;
    private delete_group_button: NodeListOf<HTMLDivElement>;
    private add_item_button: HTMLDivElement;
    private delete_item_button: HTMLDivElement;
    private generate_permalink_button: HTMLDivElement;

    private modal_items: HTMLDivElement;


    private model: GameCreatorModel;


    private card_module: HTMLDivElement;

    constructor() {
        this.card_module = document.getElementById("cards-module") as HTMLDivElement;

        this.add_group_button = document.getElementById("add_group") as HTMLDivElement;
        this.delete_group_button = document.querySelectorAll('[data-action="delete-group"]') as NodeListOf<HTMLDivElement>;

        this.add_item_button = document.getElementById("add_item") as HTMLDivElement;
        this.delete_item_button = document.getElementById("delete_item") as HTMLDivElement;

        this.generate_permalink_button = document.getElementById("generate_permalink") as HTMLDivElement;
        this.generate_permalink_button.addEventListener("click", () => {
            let a = this.model.generate_permalink();
            console.log(a);
            navigator.clipboard.writeText(a).then(r => {
                console.log("Oui");
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
            this.click_add_group_button(i);
        }

        this.populateItems();
    }

    private addEventListeners() {
        this.add_group_button.addEventListener("click", (e) => {
            if (this.click_add_group_button())
                this.model.number_of_group++;
        });

        this.delete_group_button.forEach((b) => {
            b.addEventListener("click", (e) => this.click_delete_group(b.dataset.id!));
        });

        this.add_item_button.addEventListener("click", (e) => {
            if(this.click_add_item_button())
                this.model.number_of_items++;
        });

        this.delete_item_button.addEventListener("click", () => {
            this.click_delete_item();
        })

    }


    private click_add_group_button(index_group_to_add: number = this.model.number_of_group)
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
                console.log(current_color, selector);
                if (!selector)
                {
                    color = current_color;
                    break;
                }
            }

            let s = `<section class="flex flex-1 flex-row solved-group py-3 rounded-xl bg-${color}" data-group-index="${index_group_to_add}">
                                <div class="flex flex-1 flex-col items-start text-left">
                                    <div class="flex flex-row">
                                        <h3 class="solved-group--title font-bold text-xs md:text-xl mb-2"><input type="text" name="input-${index_group_to_add}" id="input-${index_group_to_add}" placeholder="Name of the group" value="${group_name}" data-last-name="${group_name}"></h3>
                                        <div class="bg-blue-500" data-id="${index_group_to_add}" data-action="delete-group">
                                            Delete Group
                                        </div>
                                    </div>
                                    <div class="flex flex-row flex-nowrap" data-action="group-items">
                                    </div>
                                </div>
                            </section>`;

            let temp = document.createElement("div");
            temp.innerHTML = s;

            let button = temp.querySelector('[data-action="delete-group"]')! as HTMLDivElement;
            button.addEventListener('click', (e) => {
                this.click_delete_group(button.dataset.id!)
            });

            let input = temp.querySelector('input')!;

            input.addEventListener("input", (e) => {
                let el = e.target as HTMLInputElement;
                let value = el.value;
                this.model.modify_name(index_group_to_add, value);
            })

            let items_element = temp.querySelector('[data-action="group-items"]')! as HTMLDivElement;

            for (let i = 0; i < this.model.number_of_items; i++) {
                let id = this.get_random_id();
                items.push(id);
                items_element.appendChild(this.get_element_item(id, index_group_to_add));
            }

            return temp.firstElementChild as HTMLElement;
        }

        this.card_module.appendChild(get_content());
        this.model.add_group(group_name, index_group_to_add);
        this.model.add_items_in_group(index_group_to_add, items);
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
    }

    private click_add_item_button()
    {
        if (this.model.number_of_items >= 8)
            return false;

        let groups = document.querySelectorAll('[data-action="group-items"]');
        groups.forEach(group => {
            let id = this.get_random_id();
            let id_s = group.parentElement!.parentElement!.dataset.groupIndex!;
            let idx_group = parseInt(id_s)
            let new_element = this.get_element_item(id, idx_group);
            group.appendChild(new_element);
            this.model.push_item_in_group(idx_group, id)
        });

        return true;
    }

    private click_delete_item()
    {
        if (this.model.number_of_items == 1) return;

        let group_elements = document.querySelectorAll('[data-action="group-items"]');
        group_elements.forEach(group => {
            group.removeChild(group.lastChild!);
            let id_s = group.parentElement!.parentElement!.dataset.groupIndex!;
            this.model.remove_last_item(parseInt(id_s));
        })

        this.model.number_of_items--;
    }


    private get_element_item(id: number, group: number): HTMLElement
    {
        let item;
        item = Constants.ITEMS.find((item) => item.getId() == id);
        if (item == undefined)
            item = Constants.ITEMS[id];

        let string_element = `<label class="card-module flex-col aspect-square feur" data-id="${id}"><input id="card-90" type="checkbox" class="visually-hidden"><img src="${item.getImage()}" alt="${item.getAlias()}"><span class="card-module--content text-xs sm:text-sm text-wrap">${item.getAlias()}</span></label>`
        let temp = document.createElement("div");
        temp.innerHTML = string_element;
        let element = temp.firstElementChild as HTMLElement;
        element.addEventListener("click", (e) => {
            this.modal_items.dataset.groupId = group.toString();
            this.modal_items.dataset.itemId = id.toString();
            this.modal_items.classList.remove("hidden");
        })

        return temp.firstElementChild as HTMLElement;
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
        itemElement.classList.add('item');
        itemElement.dataset.id = item.getId().toString();
        itemElement.innerHTML = `<img width="64px" class="pixelated" src="${item.getImage()}" alt="${item.getAlias()}">`;
        itemElement.addEventListener('mouseover', showItemInfo.bind(this, itemElement, item));
        itemElement.addEventListener('mouseout', hideItemInfo.bind(this, itemElement, item));
        return itemElement;
    }
}