import {GameCreatorModel} from "@/GameCreator/Models/GameCreatorModel";
import {Constants} from "@/Shared/Helpers/Constants";

export class MainGameCreatorController {
    private add_group_button: HTMLDivElement;
    private delete_group_button: NodeListOf<HTMLDivElement>;
    private add_item_button: HTMLDivElement;
    private delete_item_button: HTMLDivElement;


    private model: GameCreatorModel;


    private card_module: HTMLDivElement;

    constructor() {
        this.card_module = document.getElementById("cards-module") as HTMLDivElement;

        this.add_group_button = document.getElementById("add_group") as HTMLDivElement;
        this.delete_group_button = document.querySelectorAll('[data-action="delete-group"]') as NodeListOf<HTMLDivElement>;

        this.add_item_button = document.getElementById("add_item") as HTMLDivElement;
        this.delete_item_button = document.getElementById("delete_item") as HTMLDivElement;

        this.model = new GameCreatorModel();


        this.addEventListeners();
        let default_number_of_groups = this.model.number_of_group; // used to prevent recursion from the click listener
        for (let i = 0; i < default_number_of_groups; i++) {
            this.click_add_group_button(i);
        }
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


    }


    private click_add_group_button(index_group_to_add: number = this.model.number_of_group)
    {
        if (index_group_to_add >= 8)
            return false;

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
                                        <h3 class="solved-group--title font-bold text-xs md:text-xl mb-2"><input type="text" name="input-${index_group_to_add}" id="input-${index_group_to_add}" placeholder="Name of the group"></h3>
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

            let items = temp.querySelector('[data-action="group-items"]')! as HTMLDivElement;

            for (let i = 0; i < this.model.number_of_items; i++) {
                items.appendChild(this.get_element_item());
            }

            return temp.firstElementChild as HTMLElement;
        }

        this.card_module.appendChild(get_content());
        return true;
    }

    private click_delete_group(id: string)
    {
        let el = document.querySelector('[data-group-index="' + id + '"]');
        if (el) {
            let parent = el.parentElement;
            if (parent) parent.removeChild(el);
            this.model.number_of_group--;
            console.log(this.model.number_of_group);
        }
    }

    private click_add_item_button()
    {
        if (this.model.number_of_items >= 8)
            return false;

        let groups = document.querySelectorAll('[data-action="group-items"]');
        groups.forEach(group => {
            let new_element = this.get_element_item();
            group.appendChild(new_element);
        })


        return true;
    }


    private get_element_item(id: number = -2)
    {
        let item;
        while (id == -2)
        {
            let rng = Math.floor(Math.random() * Constants.ITEMS.length);
            item = Constants.ITEMS[rng];
            console.log(item, rng);
            if (item)
                id = rng;
        }

        item = item!;

        let string_element = `<label class="card-module flex-col aspect-square" data-id="${id}"><input id="card-90" type="checkbox" class="visually-hidden"><img src="${item.getImage()}" alt="${item.getAlias()}"><span class="card-module--content text-xs sm:text-sm text-wrap">${item.getAlias()}</span></label>`
        let temp = document.createElement("div");
        temp.innerHTML = string_element;

        return temp.firstElementChild as HTMLElement;
    }
}