import { Constants } from "@/Shared/Helpers/Constants";
import { Group } from "@/Shared/Models/Group";
import { Item } from "@/Shared/Models/Item";

export class CheckController {
    private inputGroup: HTMLInputElement;
    private inputItem: HTMLInputElement;

    private dropdownGroup: HTMLDivElement;
    private dropdownItem: HTMLDivElement;

    private currentGroup: Group | null;
    private currentItem: Item | null;

    private checkInGroup: HTMLButtonElement;
    private displayIfInGroup: HTMLElement;

    private maxResults = 10;

    constructor() {
        this.inputGroup = document.getElementById('input-groups') as HTMLInputElement;
        this.inputItem = document.getElementById('input-items') as HTMLInputElement;

        this.dropdownGroup = document.getElementById('dropdown-groups') as HTMLDivElement;
        this.dropdownItem = document.getElementById('dropdown-items') as HTMLDivElement;

        this.checkInGroup = document.getElementById('check-in') as HTMLButtonElement;
        this.displayIfInGroup = document.getElementById('display-if-in') as HTMLElement;

        this.currentGroup = null;
        this.currentItem = null;
        
        this.addEventListeners();
    }

    private addEventListeners(): void {
        this.inputGroup.addEventListener('input', this.searchGroup.bind(this));
        this.inputItem.addEventListener('input', this.searchItems.bind(this));
        this.checkInGroup.addEventListener('click', this.checkIfInGroup.bind(this));


        document.addEventListener('click', (event) => {
            if (!this.inputGroup.contains(event.target as Node) && !this.dropdownGroup.contains(event.target as Node)) {
                this.dropdownGroup.classList.remove('show');
            }

            if (!this.inputItem.contains(event.target as Node) && !this.dropdownItem.contains(event.target as Node)) {
                this.dropdownItem.classList.remove('show');
            }
        });
    }

    private searchGroup(): void {
        this.dropdownGroup.innerHTML = '';

        let searchValue = this.inputGroup.value.toLowerCase();
    
        let filteredGroups = Constants.GROUPS.filter(group =>
            group.getName().toLowerCase().includes(searchValue)
        );

        filteredGroups = filteredGroups.slice(0, this.maxResults);
    
        filteredGroups.forEach(group => {
            const div = document.createElement('div');
            div.textContent = group.getName();
            div.addEventListener('click', () => {
                this.inputGroup.value = group.getName();
                this.updateCurrentGroup(group.getName());
                this.dropdownGroup.classList.remove('show');
            });
            this.dropdownGroup.appendChild(div);
        });
    
        if (filteredGroups.length > 0) {
            this.dropdownGroup.classList.add('show');
        } else {
            this.dropdownGroup.classList.remove('show');
        }

        
        this.updateCurrentGroup(this.inputGroup.value);
    }

    private updateCurrentGroup(searchValue: string) {
        if (Constants.GROUPS.filter(item => item.getName() === searchValue).length > 0) {
            this.currentGroup = Constants.GROUPS.find(item => item.getName() === searchValue)!;
        } else {
            this.currentGroup = null;
        }
        
        this.toggleButton();
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
        if (this.currentGroup && this.currentItem) {
            this.checkInGroup.disabled = false;
            this.checkInGroup.classList.remove('button--disabled');
        } else {
            this.checkInGroup.disabled = true;
            this.checkInGroup.classList.add('button--disabled');
        }
    }


    private checkIfInGroup(): void {        
        if (!this.currentGroup || !this.currentItem) {
            return;
        }
        

        const isInGroup = this.currentGroup.getItems().includes(this.currentItem);

        if (isInGroup) {
            this.displayIfInGroup.innerHTML = success;
            this.displayIfInGroup.classList.add('text-green-500');
        } else {
            this.displayIfInGroup.innerHTML = no;
            this.displayIfInGroup.classList.add('text-red-500');
        }
    }
}

let success = `The item is in the group! If you find it in another group while this group is on the grid, please don't make a bug report. There are 2 reasons of that:
<ul>
<li>You have the option: "Check grid before generate" disable ;</li>
<li>You have too many groups/items activate so the grid can't be generate after 1000 generations without theses items in extra.</li>
</ul>`;

let no = `The item is not in the group! If you think it should be, please make a bug report on the discord server. Please, use the template pinned on the channel #bug-report.`;