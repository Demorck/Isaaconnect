import { Constants } from "../Shared/Helpers/Constants.js";
import { Group } from "../Shared/Models/Group.js";
import { Item } from "../Shared/Models/Item.js";

export class CheckController {
    private inputItem: HTMLInputElement;
    private dropdownItem: HTMLDivElement;
    private currentItem: Item | null;

    private checkInGroup: HTMLButtonElement;
    private displayIfInGroup: HTMLElement;

    private maxResults = 10;

    constructor() {
        this.inputItem = document.getElementById('input-items') as HTMLInputElement;
        this.dropdownItem = document.getElementById('dropdown-items') as HTMLDivElement;

        this.checkInGroup = document.getElementById('check-in') as HTMLButtonElement;
        this.displayIfInGroup = document.getElementById('display-if-in') as HTMLElement;
        this.currentItem = null;
        
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.inputItem.addEventListener('input', this.searchItems.bind(this));
        this.checkInGroup.addEventListener('click', this.checkIfInGroup.bind(this));


        document.addEventListener('click', (event) => {
            if (!this.inputItem.contains(event.target as Node) && !this.dropdownItem.contains(event.target as Node)) {
                this.dropdownItem.classList.remove('show');
            }
        });
    }

    private searchItems(): void {
        this.dropdownItem.innerHTML = '';

        let searchValue = this.inputItem.value.toLowerCase();
    
        let filteredItems = Constants.ITEMS.filter(item =>
            item.getAlias().toLowerCase().includes(searchValue)
        );


        filteredItems = filteredItems.slice(0, this.maxResults);
    
        filteredItems.forEach(item => {
            const div = document.createElement('div');
            div.textContent = item.getAlias();
            div.addEventListener('click', () => {
                this.inputItem.value = item.getAlias();
                this.updateCurrentItem(item.getAlias());
                this.dropdownItem.classList.remove('show');
            });
            this.dropdownItem.appendChild(div);
        });

        if (filteredItems.length > 0) {
            this.dropdownItem.classList.add('show');
        } else {
            this.dropdownItem.classList.remove('show');
        }

        this.updateCurrentItem(this.inputItem.value);
    }

    private updateCurrentItem(searchValue: string) {
        if (Constants.ITEMS.filter(item => item.getAlias() === searchValue).length > 0) {
            this.currentItem = Constants.ITEMS.find(item => item.getAlias() === searchValue)!;
        } else {
            this.currentItem = null;
        }

        this.toggleButton();
    }

    private toggleButton(): void {
        if (this.currentItem) {
            this.checkInGroup.disabled = false;
            this.checkInGroup.classList.remove('button--disabled');
        } else {
            this.checkInGroup.disabled = true;
            this.checkInGroup.classList.add('button--disabled');
        }
    }


    private checkIfInGroup(): void {        
        if (!this.currentItem) {
            return;
        }
        
        let groups = Constants.GROUPS.filter(group => group.getItems().filter(item => item.getAlias() === this.currentItem!.getAlias()).length > 0);
        
        this.displayIfInGroup.innerHTML = this.createGroupElement(groups).outerHTML;
        this.displayIfInGroup.classList.add('text-red-500');
    }

    private createGroupElement(groups: Group[]): HTMLDivElement {
        const div = document.createElement('div');
        div.classList.add('group-list');
        div.textContent = 'Categories ' + this.currentItem?.getAlias() + ' is in:';

        const ul = document.createElement('ul');

        groups.forEach(group => {
            const li = document.createElement('li');
            li.textContent = group.getName();
            ul.appendChild(li);
        });

        div.appendChild(ul);
        return div;
    }
}