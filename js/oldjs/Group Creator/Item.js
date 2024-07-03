import { Constants } from "../../Helpers/Constants.js";
import { Utils } from "../../Helpers/Utils.js";

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
        itemElement.addEventListener('mouseover', this.showItemInfo.bind(this, itemElement));
        itemElement.addEventListener('mouseout', this.hideItemInfo.bind(this, itemElement));
        return itemElement;
    }

    showItemInfo(element, event) {
        console.log(event);
        let wrapper = document.querySelector('.infos');
        wrapper.innerHTML = '';
        wrapper.classList.remove('hidden');
        element.tooltip = document.createElement('div');
        element.tooltip.innerHTML = `<p>ID: ${this.id}</p><p>Nom: ${this.alias}</p>`;
        wrapper.appendChild(element.tooltip);
    }

    hideItemInfo(element, event) {
        let wrapper = document.querySelector('.infos');
        wrapper.classList.add('hidden');
    }

}