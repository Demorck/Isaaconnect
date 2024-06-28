import { Constants } from '../Constants.js';
import { Utils } from '../Utils.js';

import { GameData } from './GameData.js';
import { StatsData } from './StatsData.js';
import { SettingsData } from './SettingsData.js';


/**
 * @class StorageManager
 * @description Manages the data stored in localStorage.
 */
export class StorageManager {
    static getItem<T>(key: string, defaultValue: T | null = null): T | null {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : Constants.DEFAULT_DATA[key] ?? defaultValue;
    }

    static setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static initDefaultLocalStorage(): void {
        for (const [key, value] of (Object as any).entries(Constants.DEFAULT_DATA)) {
            if (this.getItem(key) === null) {
                this.setItem(key, value);
            }
        }
        document.body.classList.add(this.settings.theme);
    }

    static newIsaaconnect(): void {
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

    static get groupsSolved(): any[] {
        return this.game.groupsSolved;
    }

    static set groupsSolved(groupsSolved: any[]) {
        const game = this.game;
        this.game = { ...game, groupsSolved };
    }

    static get attempts(): any[] {
        return this.game.attempts;
    }

    static set attempts(attempts: any[]) {
        const game = this.game;
        this.game = { ...game, attempts };
    }

    static get currentAttempt(): number {
        return this.game.currentAttempt;
    }

    static set currentAttempt(currentAttempt: number) {
        const game = this.game;
        this.game = { ...game, currentAttempt };
    }

    static get history(): any[] {
        return this.game.history;
    }

    static set history(history: any[]) {
        const game = this.game;
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
        return this.settings.theme;
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

    static clear(): void {
        localStorage.clear();
    }
    
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
}
