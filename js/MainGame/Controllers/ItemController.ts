import { Item } from "../../Shared/Models/Item.js";
import { ItemView } from "../Views/ItemView.js";

/**
 * Controller class for handling interactions between an Item model and its view.
 * @class
 */
export class ItemController {
    
    private item: Item;
    private itemView: ItemView;

    /**
     * Creates an instance of ItemController.
     * @param {Item} item - The item model to be controlled.
     * @param {ItemView} itemView - The view associated with the item.
     */
    constructor(item: Item, itemView: ItemView) {
        this.item = item;
        this.itemView = itemView;
        this.item.addObserver(this.itemView);
        this.item.notifyObservers({ newItem: true });
        this.addEventListeners();
    }

    /**
     * Adds event listeners to the item view elements.
     * @public
     * @returns {void}
     */
    public addEventListeners(): void {
        let container = this.itemView.getItemElement();
        let checkbox = container.querySelector<HTMLInputElement>('input[type="checkbox"]');
        
        checkbox?.addEventListener('change', () => {
            let numberSelected = document.querySelectorAll('.card-module--selected').length;
            
            if (numberSelected <= 4) {
                container.classList.toggle('card-module--selected');
            }
        });
    }

    /**
     * Gets the item element from the view.
     * @public
     * @returns {HTMLElement} The item element in the view.
     */
    public getItemElement(): HTMLElement {
        return this.itemView.getItemElement();
    }
}
