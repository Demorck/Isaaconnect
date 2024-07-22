import { Group } from "../../Models/Group.js";
import { Item } from "../../Models/Item.js";
import { GroupCreatorView } from "../../Views/GroupCreator/GroupCreatorView.js";
import { ItemCreatorController } from "./ItemCreatorController.js";

export class GroupCreatorController {
    private group: Group;
    private groupView: GroupCreatorView;
    private itemsControllers: ItemCreatorController[];
    private selectedItem: ItemCreatorController | null;
    
    constructor(group: Group) {
        this.group = group;
        let element = this.createElement(group);
        this.groupView = new GroupCreatorView(element)
        this.selectedItem = null;
        this.itemsControllers = this.createItemsControllers();
        this.group.addObserver(this.groupView);
    }

    public getElement(): HTMLElement {
        return this.groupView.getElement();
    }

    private createElement(group: Group): HTMLDivElement {
        let groupElement = document.createElement('div');
        groupElement.classList.add('group', 'inline-flex', 'items-center');
        groupElement.dataset.name = this.group.getName();
        groupElement.innerHTML = `
                                <img class="pixelated mr-4" width="16px" src="/assets/gfx/Quality ${group.getDifficulty()}.png" alt="Difficulté ${group.getDifficulty()}">
                                <h3 contenteditable="true" >
                                    ${group.getName()}
                                </h3>`;
        groupElement = groupElement;

        groupElement.querySelector('h3')!.addEventListener('input', this.updateName.bind(this));
        groupElement.querySelector('img')!.addEventListener('mousedown', this.cycleDifficulty.bind(this));
        groupElement.querySelector('img')!.addEventListener('contextmenu', (event) => { event.preventDefault(); event.stopPropagation(); });
        return groupElement;
    }

    private updateName(event: Event): void {
        this.group.setName((event.target as HTMLElement).textContent!);
    }

    private cycleDifficulty(event: MouseEvent): void {
        event.preventDefault();
        let difficulty = this.group.getDifficulty();
        difficulty = (difficulty + 1) % 4;
        this.group.setDifficulty(difficulty);
    }

    public toggleItems(): void {
            document.getElementById('items-wrapper')!.innerHTML = '';
            this.groupView.select();
            this.itemsControllers.forEach(item => {
                item.addEventListener('click', () => {
                    document.querySelectorAll('.item.selected').forEach(item => {
                        item.classList.remove('selected');
                    });
                    item.select();
                    this.selectedItem = item;
                });
                document.getElementById('items-wrapper')!.appendChild(item.getElement());
            });
    }

    public addItem(item: Item): void {
        this.group.addItem(item);
        this.itemsControllers.push(new ItemCreatorController(item));
        this.toggleItems();
    }

    public removeItem(): void {
        if (!this.selectedItem) {
            return;
        }
        let item = this.selectedItem.getItem();
        this.group.removeItem(item);
        this.itemsControllers = this.itemsControllers.filter(itemController => itemController.getItem() != item);
        this.toggleItems();
        this.selectedItem = null;
    }

    private createItemsControllers(): ItemCreatorController[] {
        let items = this.group.getItems();
        let itemsControllers: ItemCreatorController[] = [];
        items.forEach(item => {
            let itemController = new ItemCreatorController(item);
            itemsControllers.push(itemController);
        });
        return itemsControllers;
    }

    public filter(filter: string) {
        let groupName = this.group.getName().toLowerCase();
        if (groupName.includes(filter)) {
            this.groupView.toggleDisplay(true);
        } else {
            this.groupView.toggleDisplay(false);
        }
    }

    public getGroup(): Group {  
        return this.group;
    }
}