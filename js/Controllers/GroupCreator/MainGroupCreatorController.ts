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
    private selectedGroup: Group | undefined;

    constructor(mainGroupCreator: MainGroupCreator, groupCreatorView: MainGroupCreatorView) {
        this.mainGroupCreator = mainGroupCreator;
        this.mainGroupCreatorView = groupCreatorView;
        this.mainGroupCreator.addObserver(this.mainGroupCreatorView);
        this.createGroups();
        this.populateItems();
    }

    public addGroup(name: string, items: Item[], difficulty: number, tags: string[] | undefined): void {
        this.mainGroupCreator.addGroup(new Group(name, items, difficulty, tags));
    }

    public updateView(): void {
        this.mainGroupCreatorView.update();
    }

    private createGroups(): void {
        let groupsWrapper = document.getElementById('groups-wrapper')!;
        Constants.GROUPS.forEach(group => {
            let groupController = new GroupCreatorController(group);
            let element = groupController.getElement();
            groupsWrapper.appendChild(element);
            element.addEventListener('click', () => { 
                document.querySelectorAll('.group').forEach(group => {
                    group.classList.remove('selected');
                });
                this.selectedGroup = group;
                groupController.toggleItems(); 
            });
            this.groupsController.push(groupController);
        });
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
}