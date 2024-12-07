import { Utils } from "../../Shared/Helpers/Utils.js";
import { Observer } from "../../Shared/Views/Observer.js";
import { Item } from "../../Shared/Models/Item.js";
import { StorageManager } from "../../Shared/Helpers/Data/StorageManager.js";


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
        itemElement.className = 'card-module flex-col aspect-square';
        itemElement.className += StorageManager.difficulty === 'normal' ? '' : ' easy';
        itemElement.dataset.id = item.getId().toString();

        const inputElement = document.createElement('input');
        inputElement.id = `card-${item.getId()}`;
        inputElement.type = 'checkbox';
        inputElement.className = 'visually-hidden';

        const imgElement = document.createElement('img');
        imgElement.src = item.getImage();
        imgElement.alt = item.getAlias();

        const spanElement = document.createElement('span');
        spanElement.className = 'card-module--content text-xs sm:text-sm text-wrap';
        spanElement.textContent = item.getAlias();

        
        
        if (item.isBlind()) {
            const imgBlind = document.createElement('img');
            imgBlind.src = '/assets/gfx/items/collectibles/questionmark.png';
            spanElement.textContent = 'Question Mark';
            imgBlind.alt = 'Question Mark';

            imgBlind.className = 'card-module--blind';
            imgElement.className = 'card-module--blind-img';
            imgElement.classList.add('hidden');
            itemElement.appendChild(imgBlind);
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