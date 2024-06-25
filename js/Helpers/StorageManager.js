import { Constants } from './Constants.js';
import { Utils } from './Utils.js';

/**
 * @class StorageManager
 * @description Manages the data stored in localStorage.
 */
export class StorageManager {
    static getItem(key, defaultValue = null) {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : Constants.DEFAULT_DATA[key] ?? defaultValue;
    }

    static setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static initDefaultLocalStorage() {
        for (const [key, value] of Object.entries(Constants.DEFAULT_DATA)) {
            if (this.getItem(key) === null) {
                this.setItem(key, value);
            }
        }
        document.body.classList.add(this.settings.theme);
    }

    static newIsaaconnect() {
        this.lastIsaaconnect = Utils.getDaysSince();
        this.game = Constants.DEFAULT_DATA.game;
    }

    static get game() {
        return this.getItem('game');
    }

    static set game(newGame) {
        const game = this.getItem('game');
        const updatedGame = { ...game, ...newGame };

        this.setItem('game', updatedGame);
    }

    static get health() {
        return this.game.health;
    }

    static set health(health) {
        const game = this.game;
        this.game = { ...game, health };
    }

    static get groupsSolved() {
        return this.game.groupsSolved;
    }

    static set groupsSolved(groupsSolved) {
        const game = this.game;
        this.game = { ...game, groupsSolved };
    }

    static get attempts() {
        return this.game.attempts;
    }

    static set attempts(attempts) {
        const game = this.game;
        this.game = { ...game, attempts };
    }

    static get currentAttempt() {
        return this.game.currentAttempt;
    }

    static set currentAttempt(currentAttempt) {
        const game = this.game;
        this.game = { ...game, currentAttempt };
    }

    static get mapItemAndGroup() {
        return this.game.mapItemAndGroup;
    }

    static set mapItemAndGroup(mapItemAndGroup) {
        const game = this.game;
        this.game = { ...game, mapItemAndGroup };
    }

    static get finished() {
        return this.game.finished;
    }

    static set finished(finished) {
        const game = this.game;
        this.game = { ...game, finished };
    }

    static get stats() {
        return this.getItem('stats');
    }

    static set stats(newStats) {
        const stats = this.getItem('stats');
        const updatedStats = { ...stats, ...newStats };

        this.setItem('stats', updatedStats);
    }

    static get winStreak() {
        return this.stats.winStreak;
    }

    static set winStreak(winStreak) {
        const stats = this.stats;
        this.stats = { ...stats, winStreak };
    }

    static get longestStreak() {
        return this.stats.longestStreak;
    }

    static set longestStreak(longestStreak) {
        const stats = this.stats;
        this.stats = { ...stats, longestStreak };
    }

    static get wins() {
        return this.stats.wins;
    }

    static set wins(wins) {
        const stats = this.stats;
        this.stats = { ...stats, wins };
    }

    static get losses() {
        return this.stats.losses;
    }

    static set losses(losses) {
        const stats = this.stats;
        this.stats = { ...stats, losses };
    }

    static get settings() {
        return this.getItem('settings');
    }

    static set settings(newSettings) {
        const settings = this.getItem('settings');
        const updatedSettings = { ...settings, ...newSettings };

        if (newSettings.theme) {
            document.body.classList.remove(settings.theme);
            document.body.classList.add(newSettings.theme);
        }

        this.setItem('settings', updatedSettings);
    }

    static get theme() {
        return this.settings.theme;
    }

    static set theme(theme) {
        const settings = this.settings;
        document.body.classList.remove(settings.theme);
        document.body.classList.add(theme);
        this.settings = { ...settings, theme };
    }

    static get autocomplete() {
        return this.settings.autocomplete;
    }

    static set autocomplete(autocomplete) {
        const settings = this.settings;
        this.settings = { ...settings, autocomplete };
    }

    static get difficulty() {
        return this.settings.difficulty;
    }

    static set difficulty(difficulty) {
        const settings = this.settings;
        this.settings = { ...settings, difficulty };
    }

    static get tts() {
        return this.settings.tts;
    }

    static set tts(tts) {
        const settings = this.settings;
        this.settings = { ...settings, tts };
    }

    static get debug() {
        return this.settings.debug;
    }

    static set debug(debug) {
        const settings = this.settings;
        this.settings = { ...settings, debug };
    }

    static clear() {
        localStorage.clear();
    }
    
    static get lastIsaaconnect() {
        return this.getItem('lastIsaaconnect');
    }

    static set lastIsaaconnect(lastIsaaconnect) {
        this.setItem('lastIsaaconnect', lastIsaaconnect);
    }
   
    static get version() {
        return this.getItem('version');
    }

    static set version(version) {
        this.setItem('version', version);
    }
}
