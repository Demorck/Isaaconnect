import { Constants } from "../Helpers/Constants.js";
import { Observable } from "../Models/Observable.js";
import { ThemeView } from "../Views/ThemeView.js";

export class ThemeController extends Observable {
    private themeStored: string;
    private themeApplied: string;
    private isVoid: boolean;
    private view: ThemeView;

    constructor(theme: string) {
        super();
        this.themeStored = theme
        this.themeApplied = theme;
        this.setTheme(theme);
        this.isVoid = this.themeStored === 'void-theme';
        this.view = new ThemeView();
        this.addObserver(this.view);
        this.notifyObservers({theme: this.themeApplied});
    }
    
    public setTheme(theme: string): void {
        if (theme !== 'void-theme') {
            this.themeApplied = theme;
        } else {
            this.themeApplied = this.randomTheme();
        }
    }

    private randomTheme(): string {
        if (this.themeApplied === null) this.themeApplied = 'basement-theme';
        let randomValue: string = this.themeApplied;
        if (this.themeApplied === 'void-theme') {
            do {
                randomValue = Constants.THEMES[Math.floor(Math.random() * Constants.THEMES.length)];
            } while (randomValue === 'void-theme');
        }

        return randomValue;
    }
}