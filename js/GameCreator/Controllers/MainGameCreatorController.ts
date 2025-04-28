

export class MainGameCreatorController {
    private add_group_button: HTMLDivElement;
    private delete_group_button: NodeListOf<HTMLDivElement>;


    private card_module: HTMLDivElement;

    constructor() {
        this.add_group_button = document.getElementById("add_group") as HTMLDivElement;
        this.card_module = document.getElementById("cards-module") as HTMLDivElement;
        this.delete_group_button = document.querySelectorAll('[data-action="delete-group"]') as NodeListOf<HTMLDivElement>;



        this.addEventListeners();
    }

    private addEventListeners() {

        this.add_group_button.addEventListener("click", (e) => this.click_add_group_button());
        this.delete_group_button.forEach((b) => {
            b.addEventListener("click", (e) => this.click_delete_group(b.dataset.id!));
        })
    }


    private click_add_group_button()
    {
        let get_content = (): HTMLElement => {
            let s = `<section class="flex flex-1 flex-row solved-group py-3 rounded-xl bg-green-400">
                            <div class="flex flex-1 flex-col items-start text-left">
                                <h3 class="solved-group--title font-bold text-xs md:text-xl mb-2">GROUPE PLACEHOLDER</h3>
                                <div class="flex flex-row flex-nowrap">
                                    <label class="card-module flex-col aspect-square" data-id="90"><input id="card-90" type="checkbox" class="visually-hidden"><img src="https://isaacguru.com/core/data/isaac/collectibles/collectibles_090_smallrock.webp" alt="The Small Rock"><span class="card-module--content text-xs sm:text-sm text-wrap">The Small Rock</span></label>
                                    <label class="card-module flex-col aspect-square" data-id="90"><input id="card-90" type="checkbox" class="visually-hidden"><img src="https://isaacguru.com/core/data/isaac/collectibles/collectibles_090_smallrock.webp" alt="The Small Rock"><span class="card-module--content text-xs sm:text-sm text-wrap">The Small Rock</span></label>
                                    <label class="card-module flex-col aspect-square" data-id="90"><input id="card-90" type="checkbox" class="visually-hidden"><img src="https://isaacguru.com/core/data/isaac/collectibles/collectibles_090_smallrock.webp" alt="The Small Rock"><span class="card-module--content text-xs sm:text-sm text-wrap">The Small Rock</span></label>
                                    <label class="card-module flex-col aspect-square" data-id="90"><input id="card-90" type="checkbox" class="visually-hidden"><img src="https://isaacguru.com/core/data/isaac/collectibles/collectibles_090_smallrock.webp" alt="The Small Rock"><span class="card-module--content text-xs sm:text-sm text-wrap">The Small Rock</span></label>
                                </div>
                            </div>
                        </section>`

            let temp = document.createElement("div");
            temp.innerHTML = s;
            return temp.firstElementChild as HTMLElement;
        }

        this.card_module.appendChild(get_content());
    }

    private click_delete_group(id: string)
    {
        let el = document.querySelector('[data-group-index="' + id + '"]');
        if (el) {
            let parent = el.parentElement;
            if (parent) parent.removeChild(el);
        }
    }
}