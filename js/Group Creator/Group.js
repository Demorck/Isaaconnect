import { Item } from './Item.js';

export class Group {
    constructor(group) {
        this.name = group.name;
        this.items = [];
        group.items.forEach(item => {
            this.items.push(new Item(item));
        })
        this.difficulty = group.difficulty;
        this.init();
    }

    init() {
        let groupElement = document.createElement('div');
        groupElement.classList.add('group', 'inline-flex', 'items-center');
        groupElement.innerHTML = `
                                <img class="pixelated mr-4" width="16px" src="/assets/gfx/Quality ${this.difficulty}.png" alt="Difficulté ${this.difficulty}">
                                <h3 contenteditable="true" >
                                    ${this.name}
                                </h3>`;
        this.groupElement = groupElement;
        this.groupElement.querySelector('h3').addEventListener('input', this.updateName.bind(this));
        this.groupElement.querySelector('img').addEventListener('mousedown', this.cycleDifficulty.bind(this));
        this.groupElement.querySelector('img').addEventListener('contextmenu', (event) => { event.preventDefault(); event.stopPropagation(); });
    }

    getGroupElement() {
        return this.groupElement;
    }

    updateName(event) {
        this.name = event.target.innerText;
    }

    addItem(item) {
        if (!this.hasItem(item)) {
            this.items.push(item);
            return true;
        }
        return false;
    }

    hasItem(item) {
        let id = item.id;
        return this.items.some(item => item.id === id);
    }

    cycleDifficulty(event) {
        if (event.button === 2) {
            this.difficulty = (this.difficulty + 3) % 4;
        } else {
            this.difficulty = (this.difficulty + 1) % 4;
        }
        event.target.src = `/assets/gfx/Quality ${this.difficulty}.png`;
        event.target.alt = `Difficulté ${this.difficulty}`;
    }

}

{/* <img class="pixelated mr-4" width="16px" src="/assets/gfx/Quality ${this.difficulty}.png" alt="Difficulté ${this.difficulty}"></img> */}