import { Constants } from "../Helpers/Constants.js";
import { Utils } from "../Helpers/Utils.js";

export class Item {
    constructor(id) {
        this.id = id;
        this.alias;
        this.init();
    }

    init() {
        Constants.ITEMS.forEach(item => {
            if (item.id === this.id) {
                this.alias = item.alias;
            }
        });
    }

    getItemElement() {
        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.dataset.id = this.id;
        itemElement.innerHTML = `<img width="64px" class="pixelated" src="/assets/gfx/items/collectibles/${Utils.numberWithLeadingZeros(this.id)}.png" alt="${this.alias}">`;
        itemElement.addEventListener('mouseenter', this.showItemInfo.bind(this, itemElement));
        itemElement.addEventListener('mouseleave', this.hideItemInfo.bind(this, itemElement));
        return itemElement;
    }

    showItemInfo(element) {
        element.tooltip = document.createElement('div');
        element.tooltip.classList.add('infos', 'px-4', 'py-2');
        element.tooltip.innerHTML = `<p>ID: ${this.id}</p><p>Nom: ${this.alias}</p>`;
        element.appendChild(element.tooltip);
    }

    hideItemInfo(element) {
        element.removeChild(element.tooltip);
    }

}