export class Constants {

    static items = null;
    static groups = null;

    static get ITEMS() {
        return this.items;
    }

    static set ITEMS(items) {
        this.items = items;
    }

    static get GROUPS() {
        return this.groups;
    }

    static set GROUPS(groups) {
        this.groups = groups;
    }

    static get URL() {
        return 'https://isaaconnect.com';
    }
    
    static get MAX_HEALTH() {
        return 4;
    }

    static get NUMBER_OF_GROUPS() {
        return 4;
    }

    static get NUMBER_OF_ITEMS() {
        return 4;
    }

    static NUMBER_OF_DAYS_BEFORE = 5;

    static BASE_DATE = new Date(2024, 4, 22);

    static COLORS = ["red-300", "blue-300", "green-300", "yellow-300"];

    static DEFAULT_DATA = {
        settings: {
            theme: 'basement-theme',
            autocomplete: false,
            difficulty: 'normal',
            debug: false,
            tts: false
        },
        game: {
            health: Constants.MAX_HEALTH,
            groupsSolved: [],
            attempts: [],
            currentAttempt: 0,
            mapItemAndGroup: new Map(),
            finished: false
        },
        stats: {
            winStreak: 0,
            longestStreak: 0,
            wins: 0,
            losses: 0,
        },
        lastIsaaconnect: 0
    };

    static VERSION = '0.8.0';
}