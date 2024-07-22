import { Group } from "../../Models/Group.js";
import { Observer } from "../Observer.js";

export class MainGroupCreatorView implements Observer {
    
    constructor() {

    }

    public update(data: any): void {        
        if (data.remove != undefined) {
            this.removeGroup(data.remove);
        }

        if (data.error != undefined) {
            alert(data.error);
        }

        if (data.data != undefined) {
            this.displayCode(data.data);
        }
    }
    
    private removeGroup(group: Group): void {
        let groupElement = document.querySelector(`[data-name="${group.getName()}"]`) as HTMLElement;
        groupElement.remove();

        let itemsWrapper = document.getElementById('items-wrapper') as HTMLElement;
        itemsWrapper.innerHTML = '';
    }

    private displayCode(data: string): void {
        let code = document.getElementById('code') as HTMLElement;
        code.innerHTML = data;

        if (code.classList.contains('hidden')) {
            code.classList.remove('hidden');
        }

        if (navigator.clipboard) {
            navigator.clipboard.writeText(data);
        }
    }

}