import { Constants } from "../../Helpers/Constants.js";
import { Utils } from "../../Helpers/Utils.js";
import { Item } from "../../Models/Item.js";
import { Observer } from "../Observer.js";

export class GroupGameView implements Observer {
    private container: HTMLElement;
    
    constructor(container: HTMLElement | string) {
        this.container = typeof container === 'string' ? document.querySelector<HTMLElement>(container)! : container;
    }

    public update(data: any): void {
        if (data.solved)
        {
            if (this.container.classList.contains('hidden')) this.container.classList.remove('hidden');

            let content = this.createContent(data);
            this.container.innerHTML += content;
        }
    }

    private createContent(data: {index: number, items: Item[], name: string }): string {
        let content =   `<section class="flex flex-1 flex-row solved-group py-3 rounded-xl bg-${Constants.COLORS[data.index]}">
                                <div class="solved-group--cards flex flex-col mr-5">
                                    <div class="flex flex-row">`;

        data.items.forEach((item, index) => {
            if (index == 2) content += `</div><div class="flex flex-row">`;
            content += `<div class="solved-group--card"><a target="_blank"  href="${Constants.WIKI + item.getAlias()}"><img src="/assets/gfx/items/collectibles/${Utils.numberWithLeadingZeros(item.getId())}.png" alt="${item.getAlias()}"></a></div>`;
            document.querySelector<HTMLElement>(`label[data-id="${item.getId()}"]`)!.remove();
        });

        content += `</div></div>
        <div class="flex flex-1 flex-col items-start text-left"><h3 class="solved-group--title font-bold text-xs md:text-xl mb-2">${data.name}</h3>
            <p class="solved-group--description text-[0.65rem] font-medium md:text-sm">`;

        data.items.forEach((item, index) => {
            content += `<a target="_blank"  href="${Constants.WIKI + item.getAlias()}">${item.getAlias()}</a>`;
            if (index != 3) content += `, `;
        });

        content += `</p></div>`;
        content += `</div></section>`;
        
        return content;
    }

}