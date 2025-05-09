import { Constants } from "@/Shared/Helpers/Constants";
import { Utils } from "@/Shared/Helpers/Utils";
import { Item } from "@/Shared/Models/Item";
import { Group } from "@/Shared/Models/Group";
import { Difficulties } from "@/Shared/Models/Enums/Difficulties";

import { GameData } from "@/Shared/Helpers/Data/GameData";
import { StatsData } from "@/Shared/Helpers/Data/StatsData";
import { SettingsData } from "@/Shared/Helpers/Data/SettingsData";
import { GroupData } from "@/Shared/Helpers/Data/GroupData";
import { GroupGame } from "@/MainGame/Models/GroupGame";
import { ItemData } from "@/Shared/Helpers/Data/ItemData";
import { RandomSettingsData } from "@/Shared/Helpers/Data/RandomSettingsData";


/**
 * @class StorageManager
 * @description Manages the data stored in localStorage.
 */
export class StorageManager {
    static getItem<T>(key: string, defaultValue: T | null = null): T | null {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : defaultValue;
    }

    static setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static initDefaultLocalStorage(): void {
        for (const [key, value] of (Object as any).entries(Constants.DEFAULT_DATA)) {
            if (this.getItem(key) === null) {
                this.setItem(key, value);
            }
            
            if (value instanceof Object) {
                let json = this.getItem(key) as any;
                for (const [k, v] of (Object as any).entries(value)) {
                    if (json[k] === undefined) {
                        json[k] = v;     
                    }
                }
                
                this.setItem(key, json);
            }
        }
        document.body.classList.add(this.settings.theme);
    }

    static newIsaaconnect(): void {
        Utils.resetIfNewVersion();
        this.lastIsaaconnect = Utils.getDaysSince();
        this.game = Constants.DEFAULT_DATA.game;
    }

    static get game(): any {
        return this.getItem('game');
    }

    static set game(newGame: any) {
        const game = this.getItem<GameData>('game');
        const updatedGame = { ...(game as object), ...(newGame as object) };
    
        this.setItem('game', updatedGame);
    }

    static get health(): number {
        return this.game.health;
    }

    static set health(health: number) {
        const game = this.game;
        this.game = { ...game, health };
    }

    static get groupFound(): number {
        return this.game.groupFound;
    }

    static set groupFound(groupFound: number) {
        const game = this.game;
        this.game = { ...game, groupFound };
    }

    static get groupsSolved(): GroupData[] {
        return this.game.groupsSolved;
    }

    static set groupsSolved(data: GroupGame[]) {
        const game = this.game;
        let groupsSolved = data.map(group => group.getData());
        this.game = { ...game, groupsSolved };
    }

    static get attempts(): GroupData[][] {
        return this.game.attempts;
    }

    static set attempts(data: Group[][]) {
        const game = this.game;
        let attempts = data.map(groups => groups.map(group => group.getData()));
        this.game = { ...game, attempts };
    }

    static get currentAttempt(): number {
        return this.game.currentAttempt;
    }

    static set currentAttempt(currentAttempt: number) {
        const game = this.game;
        this.game = { ...game, currentAttempt };
    }

    static get history(): ItemData[][] {
        return this.game.history;
    }

    static set history(data: Item[][]) {
        const game = this.game;
        let history = data.map(items => items.map(item => item.getData()));
        this.game = { ...game, history };
    }

    static get mapItemAndGroup(): Map<any, any> {
        return this.game.mapItemAndGroup;
    }

    static set mapItemAndGroup(mapItemAndGroup: Map<any, any>) {
        const game = this.game;
        this.game = { ...game, mapItemAndGroup };
    }

    static get finished(): boolean {
        return this.game.finished;
    }

    static set finished(finished: boolean) {
        const game = this.game;
        this.game = { ...game, finished };
    }

    static get timer(): number {
        return this.game.timer;
    }

    static set timer(timer: number) {
        const game = this.game;
        this.game = { ...game, timer };
    }

    static get stats(): any {
        return this.getItem('stats');
    }

    static set stats(newStats: any) {
        const stats = this.getItem<StatsData>('stats');
        const updatedStats = { ...stats, ...newStats };

        this.setItem('stats', updatedStats);
    }

    static get winStreak(): number {
        return this.stats.winStreak;
    }

    static set winStreak(winStreak: number) {
        const stats = this.stats;
        this.stats = { ...stats, winStreak };
    }

    static get longestStreak(): number {
        return this.stats.longestStreak;
    }

    static set longestStreak(longestStreak: number) {
        const stats = this.stats;
        this.stats = { ...stats, longestStreak };
    }

    static get wins(): number {
        return this.stats.wins;
    }

    static set wins(wins: number) {
        const stats = this.stats;
        this.stats = { ...stats, wins };
    }

    static get losses(): number {
        return this.stats.losses;
    }

    static set losses(losses: number) {
        const stats = this.stats;
        this.stats = { ...stats, losses };
    }


    /*******************************************/
    /***************** Settings ****************/
    /*******************************************/

    static get settings(): any {
        return this.getItem('settings');
    }

    static set settings(newSettings: any) {
        const settings = this.getItem<SettingsData>('settings');
        const updatedSettings = { ...settings, ...newSettings };

        if (newSettings.theme && settings != null) {
            document.body.classList.remove(settings.theme);
            document.body.classList.add(newSettings.theme);
        }

        this.setItem('settings', updatedSettings);
    }

    static get theme(): string {
        return this.settings?.theme;
    }

    static set theme(theme: string) {
        const settings = this.settings;
        document.body.classList.remove(settings.theme);
        document.body.classList.add(theme);
        this.settings = { ...settings, theme };
    }

    static get autocomplete(): boolean {
        return this.settings.autocomplete;
    }

    static set autocomplete(autocomplete: boolean) {
        const settings = this.settings;
        this.settings = { ...settings, autocomplete };
    }

    static get difficulty(): string {
        return this.settings.difficulty;
    }

    static set difficulty(difficulty: string) {
        const settings = this.settings;
        this.settings = { ...settings, difficulty };
    }

    static get redirect(): boolean {
        return this.settings.redirect;
    }

    static set redirect(redirect: boolean) {
        const settings = this.settings;
        this.settings = { ...settings, redirect };
    }

    static get tts(): boolean {
        return this.settings.tts;
    }

    static set tts(tts: boolean) {
        const settings = this.settings;
        this.settings = { ...settings, tts };
    }

    static get debug(): boolean {
        return this.settings.debug;
    }

    static set debug(debug: boolean) {
        const settings = this.settings;
        this.settings = { ...settings, debug };
    }

    static get link(): boolean {
        return this.settings.link;
    }

    static set link(link: boolean) {
        const settings = this.settings;
        this.settings = { ...settings, link };
    }

    static get enableTimer(): boolean {
        return this.settings.enableTimer;
    }

    static set enableTimer(enableTimer: boolean) {
        const settings = this.settings;
        this.settings = { ...settings, enableTimer };
    }

    /*******************************************/
    /************* Random Settings *************/
    /*******************************************/

    static get randomSettings(): any {
        return this.getItem('randomSettings');
    }

    static set randomSettings(newRandomSettings: any) {
        const randomSettings = this.getItem<RandomSettingsData>('randomSettings');
        const updatedRandomSettings = { ...randomSettings, ...newRandomSettings };
        this.setItem('randomSettings', updatedRandomSettings);
    }

    static get bannedTags(): boolean {
        return this.randomSettings.bannedTags;
    }

    static set bannedTags(bannedTags: boolean) {
        const randomSettings = this.randomSettings;
        this.randomSettings = { ...randomSettings, bannedTags };
    }

    static get checkGrid(): boolean {
        return this.randomSettings.checkGrid;
    }

    static set checkGrid(checkGrid: boolean) {
        const randomSettings = this.randomSettings;
        this.randomSettings = { ...randomSettings, checkGrid };
    }

    static get numberOfGroups(): number {
        return this.randomSettings.numberOfGroups;
    }

    static set numberOfGroups(numberOfGroups: number) {
        const randomSettings = this.randomSettings;
        this.randomSettings = { ...randomSettings, numberOfGroups };
    }

    static get numberOfItems(): number {
        return this.randomSettings.numberOfItems;
    }

    static set numberOfItems(numberOfItems: number) {
        const randomSettings = this.randomSettings;        
        this.randomSettings = { ...randomSettings, numberOfItems };
    }

    static get numberOfBlindItems(): number {
        return this.randomSettings.numberOfBlindItems;
    }

    static set numberOfBlindItems(numberOfBlindItems: number) {
        const randomSettings = this.randomSettings;        
        this.randomSettings = { ...randomSettings, numberOfBlindItems };
    }

    static get randomHealth(): number {
        return this.randomSettings.randomHealth;
    }

    static set randomHealth(randomHealth: number) {
        const randomSettings = this.randomSettings;        
        this.randomSettings = { ...randomSettings, randomHealth };
    }


    static get customDifficulty(): Difficulties {
        return this.randomSettings.customDifficulty;
    }

    static set customDifficulty(customDifficulty: Difficulties) {
        const randomSettings = this.randomSettings;
        this.randomSettings = { ...randomSettings, customDifficulty };
    }

    static get revealSubmittedBlind(): boolean {
        return this.randomSettings.revealSubmittedBlind;
    }

    static set revealSubmittedBlind(revealSubmittedBlind: boolean) {
        const randomSettings = this.randomSettings;
        this.randomSettings = { ...randomSettings, revealSubmittedBlind };
    }

    /*******************************************/
    /***************** Others ******************/
    /*******************************************/
    
    static get lastIsaaconnect(): number {
        return this.getItem('lastIsaaconnect') ?? Constants.DEFAULT_DATA.lastIsaaconnect;
    }

    static set lastIsaaconnect(lastIsaaconnect: number) {
        this.setItem('lastIsaaconnect', lastIsaaconnect);
    }
   
    static get version(): string {
        return this.getItem('version') ?? Constants.DEFAULT_DATA.version;
    }

    static set version(version: string) {
        this.setItem('version', version);
    }


    static set modal(modal: boolean) {
        this.setItem('modal', modal);
    }

    static get modal(): boolean {
        return this.getItem('modal') ?? Constants.DEFAULT_DATA.modal;
    }

}
