import { Constants } from '../../Helpers/Constants.js';
import { DataFetcher } from '../../Helpers/DataFetcher.js';
import { StorageManager } from '../../Helpers/StorageManager.js';
import { Utils } from '../../Helpers/Utils.js';
import { initializeTooltipListener } from '../Tooltips/Tooltips.js';

export class Editor {
    constructor() {
        this.items = [];
        this.groups = [];
        this.matrix = [];
        for (let i = 0; i < Constants.NUMBER_OF_GROUPS; i++) {
            this.matrix.push(new Array(Constants.NUMBER_OF_ITEMS).fill(0));
        }
        this.init();
    }

    async init() {
        const data = await DataFetcher.fetchData();
        this.items = data.items;
        this.groups = data.groups;
        this.displaySquare();
        this.createItems();
        this.addEventListeners();
    }

    displaySquare() {
        const container = document.querySelector('#cards-module');
        let difficulty = StorageManager.difficulty
        for (let i = 0; i < Constants.NUMBER_OF_GROUPS * Constants.NUMBER_OF_ITEMS; i++) {
            container.innerHTML += `
                <label class="card-module flex-col" data-id="0">
                    <input id="card-${i}" type="checkbox" class="visually-hidden">
                    <img src="/assets/gfx/items/collectibles/questionmark.png" alt="-">
                    <span class="card-module--content text-xs sm:text-sm ${difficulty == "normal" ? "hidden" : ""}">-</span>
                </label>
            `;
        }
    }

    addEventListeners() {
        const cards = document.querySelectorAll('.card-module');
        cards.forEach(card => card.addEventListener('click', this.handleCardClick.bind(this, card)));

        let filterItem = document.getElementById('filter-items-input');
        filterItem.addEventListener('input', this.filterItem.bind(this));

        let closeEditor = document.getElementById('close-editor');
        closeEditor.addEventListener('click', this.closeEditor.bind(this));
    }

    createItems() {
        let filterResult = document.querySelector('#filter-result');
        this.items.forEach(item => {
            filterResult.innerHTML += `
                <li class="text-black filter-result--item hidden" data-id="${item.id}">${item.alias}</li>
            `;
        });

        this.addClickEventToFilteredItems();
    }

    addItem(event, item) {
        let selectedCard = document.querySelector('.card-module--selected');
        let index = selectedCard.querySelector('input').id.split('-')[1];
        let group = Math.floor(index / Constants.NUMBER_OF_ITEMS);
        let itemIndex = index % Constants.NUMBER_OF_ITEMS;
        
        this.matrix[group][itemIndex] = item.id;

        let cardContent = selectedCard.querySelector('.card-module--content');
        cardContent.innerText = item.alias;

        let cardImage = selectedCard.querySelector('img');
        cardImage.src = `/assets/gfx/items/collectibles/${Utils.numberWithLeadingZeros(item.id)}.png`;
    }

    addClickEventToFilteredItems() {
        const filteredItems = document.querySelectorAll('.filter-result--item');
        filteredItems.forEach(item => {
            item.addEventListener('click', (event) => {
                const selectedItem = this.items.find(i => i.id == item.getAttribute('data-id'));
                this.addItem(event, selectedItem);
            });
        });
    }

    handleCardClick(element) {
        let editorBackground = document.querySelector('#editor-background');
        let editorModal = document.querySelector('#editor-modal');
        let cards = document.querySelectorAll('.card-module');
        cards.forEach(card => {
            card.classList.remove('card-module--disabled');
            card.classList.remove('card-module--selected');
            if (card === element) return;
            card.classList.add('card-module--disabled');
        });
        
        element.classList.add('card-module--selected');
        editorBackground.classList.remove('hidden');
        editorModal.classList.remove('hidden');
    }

    filterItem(event) {
        const filterValue = event.target.value.toLowerCase();
        let filterResult = document.querySelector('#filter-result');
        let filteredItems = this.items.filter(item => item.alias.toLowerCase().includes(filterValue));

        for (let i = 0; i < filterResult.children.length; i++) {
            let item = filterResult.children[i];
            let itemName = item.innerText.toLowerCase();
            if (itemName.includes(filterValue)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        }
    }

    closeEditor() {
        let editorBackground = document.querySelector('#editor-background');
        let editorModal = document.querySelector('#editor-modal');
        let cards = document.querySelectorAll('.card-module');
        cards.forEach(card => {
            card.classList.remove('card-module--disabled');
            card.classList.remove('card-module--selected');
        });

        editorBackground.classList.add('hidden');
        editorModal.classList.add('hidden');
    }
}

let theme = StorageManager.theme;
if (theme === null) theme = 'basement-theme';
if (theme === 'void-theme') {
    do {
        let randomValue = Constants.THEMES[Math.floor(Math.random() * Constants.THEMES.length)];
        theme = randomValue;
    } while (theme === 'void-theme');
}
document.querySelector('body').classList.add(theme);
  
const setVisible = (elementOrSelector, visible) => 
    (typeof elementOrSelector === 'string'
        ? document.querySelector(elementOrSelector)
        : elementOrSelector
    ).style.display = visible ? 'flex' : 'none';

setVisible('.page', false);
setVisible('.loader', true);

document.addEventListener('DOMContentLoaded', () =>
    Utils.sleep(1000).then(() => {
        setVisible('.page', true);
        setVisible('.loader', false);
        initializeTooltipListener();
        let editor = new Editor();
    })
);