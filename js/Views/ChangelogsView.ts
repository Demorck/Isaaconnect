import { Constants } from "../Helpers/Constants.js";
import { Utils } from "../Helpers/Utils.js";

export class ChangelogsView {
    private _bigmodal: HTMLElement;
    private _bigmodalbackground: HTMLElement;
    private _currentVersion: string;

    constructor(version: string = Constants.VERSION) {
        this._bigmodal = document.getElementById('bigmodal-wrapper') as HTMLElement;
        this._bigmodal.classList.add('left-1/2', 'transform', '-translate-x-1/2');
        this._bigmodalbackground = document.getElementById('bigmodal-background') as HTMLElement;
        this._currentVersion = version;
    }

    public showNewChangelogs(): void {
        this.retrieveWrapper().then(() => {
            this._bigmodalbackground.classList.remove('hidden');
            this._bigmodal.classList.remove('hidden');
            this.addEventListeners();
        });
    }

    private async retrieveWrapper(): Promise<void> {
        let html = await Utils.loadHTML('/include/modals/changelogs/wrapper.html');
        this._bigmodal.innerHTML = html;
        html = await this.retrieveChangelogs();
        let logsWrapper = this._bigmodal.querySelector('#changelogs-wrapper') as HTMLElement;
        logsWrapper.innerHTML = html;
    }

    private async retrieveChangelogs(): Promise<string> {
        let changelogs = await Utils.loadHTML(`/include/modals/changelogs/${this._currentVersion}.html`);
        return changelogs;
    }

    private addEventListeners(): void {
        let closeButton = document.querySelector('.close-button');
        closeButton?.addEventListener('click', () => {
            this.removeModal();
        })
        
        closeButton = document.querySelector('[data-action="close"]');
        closeButton?.addEventListener('click', () => {
            this.removeModal();
        });

        let changelogButtons = document.querySelectorAll('.language-switch button');
        changelogButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                changelogButtons.forEach(b => {
                    b.classList.remove('button--language-active')
                    if (b === button)
                        b.classList.add('button--language-active');
                });
                
                this.changeLanguage(e);
            });
        })
    }

    private changeLanguage(e: Event): void {
        let target = e.target as HTMLElement;
        let lang = target.getAttribute('data-lang');
        let languages = document.querySelectorAll('.language');
        languages.forEach(language => {
            if (language.getAttribute('data-lang') === lang) {
                language.classList.remove('hidden');
            } else {
                language.classList.add('hidden');
            }
        });
    }

    private removeModal(): void {
        this._bigmodalbackground.classList.add('hidden');
        this._bigmodal.classList.add('hidden');
        this._bigmodal.innerHTML = '';
    }
}