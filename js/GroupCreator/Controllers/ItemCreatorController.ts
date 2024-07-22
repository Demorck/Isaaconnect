import { Utils } from "../../Shared/Helpers/Utils.js";
import { Item } from "../../Shared/Models/Item.js";
import { ItemCreatorView } from "../Views/ItemCreatorView.js";

export class ItemCreatorController {
    private item: Item;
    private itemView: ItemCreatorView;

    constructor(item: Item) {
        this.item = item;
        let element = this.createElement();
        this.itemView = new ItemCreatorView(element);
        this.item.addObserver(this.itemView);
    }

    public addEventListener(event: string, callback: EventListener): void {
        this.itemView.addEventListener(event, callback);
    }

    public select(): void {
        this.itemView.select();
    }

    public getElement(): HTMLElement {
        return this.itemView.getElement();
    }

    public getItem(): Item {
        return this.item;
    }

    private createElement(): HTMLDivElement {
        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.dataset.id = this.item.getId().toString();
        itemElement.innerHTML = `<img width="64px" class="pixelated" src="/assets/gfx/items/collectibles/${Utils.numberWithLeadingZeros(this.item.getId())}.png" alt="${this.item.getAlias()}">`;
        itemElement.addEventListener('mouseover', this.showItemInfo.bind(this, itemElement));
        itemElement.addEventListener('mouseout', this.hideItemInfo.bind(this, itemElement));
        return itemElement;
    }

    private showItemInfo(element: HTMLDivElement): void {
        let wrapper = document.querySelector('.infos')!;
        wrapper.innerHTML = '';
        wrapper.classList.remove('hidden');
        const children = document.createElement('div');
        children.innerHTML = `<p>ID: ${this.item.getId()}</p><p>Nom: ${this.item.getAlias()}</p>`;
        wrapper.appendChild(children);
    }

    private hideItemInfo(element: HTMLElement): void {
        let wrapper = document.querySelector('.infos')!;
        wrapper.classList.add('hidden');
    }
}