import { Item } from "../../Models/Item.js";
import { ItemView } from "../../Views/MainGame/ItemView.js";

export class ItemController {
    private item: Item;
    private itemView: ItemView;

    constructor(item: Item, itemView: ItemView) {
        this.item = item
        this.itemView = itemView;
        this.item.addObserver(this.itemView);
    }

    public addEventListeners(): void {
        let container = this.itemView.getItemElement();
        let checkbox = container.querySelector('input[type="checkbox"]');

        checkbox?.addEventListener('change', () => {
            let numberSelected = document.querySelectorAll('.card-module--selected').length;
            if (numberSelected <= 4) {
                container.classList.toggle('card-module--selected');
            }
        });
    }
}