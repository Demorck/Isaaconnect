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
        groupElement.classList.add('group');
        groupElement.innerHTML = `<h3>${this.name}</h3>`;
        this.groupElement = groupElement;
    }

    addPerson(person) {
        this.group.push(person);
    }

    getGroupElement() {
        return this.groupElement;
    }
}