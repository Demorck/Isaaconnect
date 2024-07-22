import { Constants } from "../../Helpers/Constants.js";
import { Utils } from "../../Helpers/Utils.js";
import { Group } from "../../Models/Group.js";
import { MainGroupCreator } from "../../Models/GroupCreator/MainGroupCreator.js";
import { Item } from "../../Models/Item.js";
import { MainGroupCreatorView } from "../../Views/GroupCreator/MainGroupCreatorView.js";
import { GroupCreatorController } from "./GroupCreatorController.js";

export class MainGroupCreatorController {
    private mainGroupCreator: MainGroupCreator;
    private mainGroupCreatorView: MainGroupCreatorView;
    private itemsToAdd: Item[] = [];
    private groupsController: GroupCreatorController[] = []; 
    private selectedGroup: GroupCreatorController | undefined;
    private regex: boolean

    constructor(mainGroupCreator: MainGroupCreator, groupCreatorView: MainGroupCreatorView) {
        this.mainGroupCreator = mainGroupCreator;
        this.mainGroupCreatorView = groupCreatorView;
        this.regex = false;
        this.mainGroupCreator.addObserver(this.mainGroupCreatorView);
        this.createGroups();
        this.populateItems();
        this.addEventListeners();
    }

    // public addGroup(name: string, items: Item[], difficulty: number, tags: string[] | undefined): void {
    //     this.mainGroupCreator.addGroup(new Group(name, items, difficulty, tags));
    // }

    private createGroups(): void {
        Constants.GROUPS.forEach(group => {
            this.mainGroupCreator.addGroup(group);
            let groupController = this.newGroupController(group);
            this.groupsController.push(groupController);
        });
    }

    private newGroupController(group: Group): GroupCreatorController {
        let groupController = new GroupCreatorController(group);
        let element = groupController.getElement();
        document.getElementById('groups-wrapper')?.appendChild(element);
        element.addEventListener('click', this.selectGroup.bind(this, group, groupController));
        return groupController;
    }

    private populateItems(): void {
        let itemsWrapper = document.getElementById('items')!;
        Constants.ITEMS.forEach(item => {
            let element = MainGroupCreatorController.createItemElement(item);
            element.addEventListener('click', () => {
                element.classList.toggle('selected');
                if (this.itemsToAdd.includes(item)) {
                    let index = this.itemsToAdd.indexOf(item);
                    this.itemsToAdd.splice(index, 1);
                } else {
                    this.itemsToAdd.push(item);
                }
            });
            itemsWrapper.appendChild(element);
        });
    }

    private static createItemElement(item: Item): HTMLElement {
        const showItemInfo = (element: HTMLDivElement, item: Item) => {
            let wrapper = document.querySelector('.infos')!;
            wrapper.innerHTML = '';
            wrapper.classList.remove('hidden');
            const children = document.createElement('div');
            children.innerHTML = `<p>ID: ${item.getId()}</p><p>Nom: ${item.getAlias()}</p>`;
            wrapper.appendChild(children);
        };
        const hideItemInfo = (element: HTMLElement, item: Item) => {
            let wrapper = document.querySelector('.infos')!;
            wrapper.classList.add('hidden');
        };

        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.dataset.id = item.getId().toString();
        itemElement.innerHTML = `<img width="64px" class="pixelated" src="/assets/gfx/items/collectibles/${Utils.numberWithLeadingZeros(item.getId())}.png" alt="${item.getAlias()}">`;
        itemElement.addEventListener('mouseover', showItemInfo.bind(this, itemElement, item));
        itemElement.addEventListener('mouseout', hideItemInfo.bind(this, itemElement, item));
        return itemElement;
    }

    private addEventListeners(): void {
        let filter = document.getElementById('filter-input');
        filter?.addEventListener('input', this.filterGroups.bind(this));

        let addGroup = document.getElementById('add-group');
        addGroup?.addEventListener('click', this.addGroup.bind(this));
        
        let removeGroup = document.getElementById('delete-group');
        removeGroup?.addEventListener('click', this.removeGroup.bind(this));

        let filterItem = document.getElementById('filter-items-input');
        filterItem?.addEventListener('input', this.filterItem.bind(this));

        let addItem = document.getElementById('add-item');
        addItem?.addEventListener('click', this.addItem.bind(this));
        
        let removeItem = document.getElementById('delete-item');
        removeItem?.addEventListener('click', this.removeItem.bind(this));

        let generate = document.getElementById('generate');
        generate?.addEventListener('click', this.generate.bind(this));

        let toggleRegex = document.getElementById('toggle-regex');
        toggleRegex?.addEventListener('click', this.toggleRegex.bind(this));

        let code = document.getElementById('code');
        code?.addEventListener('click', this.copyCode.bind(this));
    }

    private selectGroup(group: Group, groupController: GroupCreatorController): void {
        document.querySelectorAll('.group').forEach(group => {
            group.classList.remove('selected');
        });
        this.selectedGroup = groupController;
        groupController.toggleItems(); 
    }

    private filterGroups(event: Event): void {
        let element = event.target as HTMLInputElement;
        let filter = element.value.toLowerCase();
        this.groupsController.forEach(group => group.filter(filter));
    }

    private addGroup() {
        let name = prompt('Nom du groupe');
        if (name) {
            let group = new Group(name, this.itemsToAdd, 0, undefined);
            let groupController = this.newGroupController(group);
            this.groupsController.push(groupController);
            this.mainGroupCreator.addGroup(group);
        }
    }

    private removeGroup() {
        if (this.selectedGroup) {
            this.mainGroupCreator.removeGroup(this.selectedGroup.getGroup());
            this.groupsController = this.groupsController.filter(group => group.getGroup() != this.selectedGroup?.getGroup());
            
            this.selectedGroup = undefined;
        }
    }

    private filterItem(event: Event): void {
        let items = document.getElementById('items')!.children;
        let target = event.target as HTMLInputElement;
        if (this.regex)
        {   
            try {
                let filter = target.value.trim();
                for (let i = 0; i < items.length; i++) {
                    let group = items[i] as HTMLDivElement;
                    let image = group.children[0] as HTMLImageElement;
                    let name = image.alt;
                    let regex = new RegExp(filter, 'i');
                    if (regex.test(name)) {
                        group.style.display = '';
                    } else {
                        group.style.display = 'none';
                    }
                }
            } catch (ignored) {}
        }
        else
        {
            let filter = target.value.toLowerCase().trim();
            for (let i = 0; i < items.length; i++) {
                let group = items[i] as HTMLDivElement;
                let image = group.children[0] as HTMLImageElement;
                let name = image.alt.toLowerCase();
                if (name.indexOf(filter) > -1) {
                    group.style.display = '';
                } else {
                    group.style.display = 'none';
                }
            }
        }
    }

    private addItem() {
        if (this.selectedGroup && this.itemsToAdd.length > 0) {
            this.itemsToAdd.forEach(item => this.selectedGroup?.addItem(item));

            this.itemsToAdd = [];
            let itemsWrapper = document.querySelectorAll('#items .selected');
            itemsWrapper.forEach(item => {
                item.classList.remove('selected');
            });

        }
    }

    private removeItem() {        
        if (this.selectedGroup) {
            this.selectedGroup.removeItem();
        }
    }

    private generate() {
        this.mainGroupCreator.generate();
    }

    private toggleRegex(event: Event) {
        let target = event.target as HTMLInputElement;
        this.regex = target.checked;
        let filterItem = document.getElementById('filter-items-input');
        filterItem?.dispatchEvent(new Event('input'));
    }

    private copyCode() {
        let code = document.getElementById('code') as HTMLElement;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(code.innerText).then(() => {
                console.log('Text copied to clipboard');
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        }
        
        if (document.createRange && window.getSelection) {
            let range = document.createRange();
            range.selectNodeContents(code);
            let sel = window.getSelection()!;
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}