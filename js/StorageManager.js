import { Constants } from './Constants.js';

export class StorageManager {
    static defaults = {
        theme: 'basement-theme',
        autocomplete: false,
        difficulty: 'normal',
        winStreak: 0,
        longestStreak: 0,
        wins: 0,
        losses: 0,
        lastIsaaconnect: 0,
        health: Constants.MAX_HEALTH,
        groupsSolved: [],
        attempts: []
    };

    static getItem(key, defaultValue = null) {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : this.defaults[key] ?? defaultValue;
    }

    static setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static initDefaultLocalStorage() {
        
        for (const [key, value] of Object.entries(this.defaults)) {
            if (localStorage.getItem(key) === null) {
                this.setItem(key, value);
            }
        }

        document.body.classList.add(this.getItem('theme'));
    }

    static newIsaaconnect() {
        this.setItem('lastIsaaconnect', Utils.getDaysSince());
        this.setItem('health', Constants.MAX_HEALTH);
        this.setItem('groupsSolved', []);
        this.setItem('attempt', []);
    }

    static get attempts() {
        return this.getItem('attempts');
    }

    static set attempts(attempt) {
        this.setItem('attempts', attempt);
    }

    static get health() {
        return this.getItem('health');
    }

    static set health(health) {
        this.setItem('health', health);
    }

    static get groupsSolved() {
        return this.getItem('groupsSolved');
    }

    static set groupsSolved(groupsSolved) {
        this.setItem('groupsSolved', groupsSolved);
    }

    static resetWinStreak() {
        this.setItem('winStreak', 0);
    }

    static get winStreak() {
        return this.getItem('winStreak');
    }

    static get longestStreak() {
        return this.getItem('longestStreak');
    }

    static set longestStreak(longestStreak) {
        this.setItem('longestStreak', longestStreak);
    }

    static get wins() {
        return this.getItem('wins');
    }

    static set wins(wins) {
        this.setItem('wins', wins);
    }

    static get losses() {
        return this.getItem('losses');
    }

    static set losses(losses) {
        this.setItem('losses', losses);
    }

    static get lastIsaaconnect() {
        return this.getItem('lastIsaaconnect');
    }

    static set lastIsaaconnect(lastIsaaconnect) {
        this.setItem('lastIsaaconnect', lastIsaaconnect);
    }

    static get theme() {
        return this.getItem('theme');
    }

    static set theme(theme) {
        document.body.classList.remove(this.theme);
        document.body.classList.add(theme);
        this.setItem('theme', theme);
    }

    static get autocomplete() {
        return this.getItem('autocomplete');
    }

    static set autocomplete(autocomplete) {
        this.setItem('autocomplete', autocomplete);
    }

    static get difficulty() {
        return this.getItem('difficulty');
    }

    static set difficulty(difficulty) {
        this.setItem('difficulty', difficulty);
    }
}
