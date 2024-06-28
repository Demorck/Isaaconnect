import { StorageManager } from "../Helpers/Data/StorageManager.js";
import { Observable } from "../Models/Observable.js";
import { ThemeView } from "../Views/ThemeView.js";

export class ThemeController extends Observable {
    private theme: string;
    private view: ThemeView;

    constructor() {
        super();
        this.theme = StorageManager.theme;
        this.view = new ThemeView();
        this.addObserver(this.view);
        this.notifyObservers(this.theme);
    }

    public getTheme(): string {
        return this.theme;
    }

    public setTheme(theme: string): void {
        this.theme = theme;
        StorageManager.theme = theme;
        this.notifyObservers(this.theme);
    }
}