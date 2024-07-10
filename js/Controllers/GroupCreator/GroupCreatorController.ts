import { Group } from "../../Models/Group.js";
import { GroupCreatorView } from "../../Views/GroupCreator/GroupCreatorView.js";
import { ItemCreatorController } from "./ItemCreatorController.js";

export class GroupCreatorController {
    private group: Group;
    private groupView: GroupCreatorView;
    private itemsControllers: ItemCreatorController[];
    private selectedItem: ItemCreatorController | null;
    
    constructor(group: Group) {
        let element = this.createElement(group);
        this.groupView = new GroupCreatorView(element)
        this.group = group;
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

    private createItemsControllers(): ItemCreatorController[] {
        console.log(this.group);
        
        let items = this.group.getItems();
        let itemsControllers: ItemCreatorController[] = [];
        items.forEach(item => {
            let itemController = new ItemCreatorController(item);
            itemsControllers.push(itemController);
        });
        return itemsControllers;
    }
}