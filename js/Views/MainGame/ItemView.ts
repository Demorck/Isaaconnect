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
    private blind: boolean;

    constructor(itemContainerId: string, item: Item, blind: boolean = false) {
        this.blind = blind;
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
        itemElement.className = 'card-module flex-col sm:aspect-square';
        itemElement.className += StorageManager.difficulty === 'normal' ? '' : ' easy';
        itemElement.dataset.umamiEvent = "Cell clicked";
        itemElement.dataset.id = item.getId().toString();

        const inputElement = document.createElement('input');
        inputElement.id = `card-${item.getId()}`;
        inputElement.type = 'checkbox';
        inputElement.className = 'visually-hidden';

        const imgElement = document.createElement('img');
        imgElement.src = `/assets/gfx/items/collectibles/${Utils.numberWithLeadingZeros(item.getId())}.png`;
        imgElement.alt = item.getAlias();

        const spanElement = document.createElement('span');
        spanElement.className = 'card-module--content text-xs sm:text-sm text-wrap';
        spanElement.textContent = item.getAlias();

        
        
        if (this.blind) {
            imgElement.src = '/assets/gfx/items/collectibles/questionmark.png';
            spanElement.textContent = 'Question Mark';
        }

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