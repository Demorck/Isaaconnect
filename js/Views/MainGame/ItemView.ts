import { Utils } from "../../Helpers/Utils.js";
import { Observer } from "../Observer.js";
import { Item } from "../../Models/Item.js";
import { StorageManager } from "../../Helpers/Data/StorageManager.js";


/**
 * @description View for each item
 *
 * @export
 * @class ItemView
 * @type {ItemView}
 * @implements {Observer}
 */
export class ItemView implements Observer {
    private itemContainer: HTMLElement;
    private itemElement: HTMLElement;

    constructor(itemContainerId: string, item: Item) {
        this.itemContainer = document.getElementById(itemContainerId)!;
        this.itemElement = this.createItemElement(item);
    }

    public update(data: any): void {
        if (data.shake) {
            this.itemElement.classList.add('card-module--shake');
            setTimeout(() => {
                this.itemElement.classList.remove('card-module--shake');
            }, 1000);
        }
        
        if (data.newItem) {
            this.itemContainer.appendChild(this.itemElement!);
        }
    }

    private createItemElement(item: Item): HTMLElement {
        const itemElement = document.createElement('label');
        itemElement.className = 'card-module flex-col';
        itemElement.dataset.id = item.getId().toString();

        const inputElement = document.createElement('input');
        inputElement.id = `card-${item.getId()}`;
        inputElement.type = 'checkbox';
        inputElement.className = 'visually-hidden';

        const imgElement = document.createElement('img');
        imgElement.src = `/assets/gfx/items/collectibles/${Utils.numberWithLeadingZeros(item.getId())}.png`;
        imgElement.alt = item.getAlias();

        const spanElement = document.createElement('span');
        spanElement.className = 'card-module--content text-xs sm:text-sm';
        spanElement.className += StorageManager.difficulty === 'normal' ? ' hidden' : '';
        spanElement.textContent = item.getAlias();

        itemElement.appendChild(inputElement);
        itemElement.appendChild(imgElement);
        itemElement.appendChild(spanElement);

        return itemElement;
    }

    public getContainer(): HTMLElement {
        return this.itemContainer;
    }

    public getItemElement(): HTMLElement {
        return this.itemElement;
    }
    
}