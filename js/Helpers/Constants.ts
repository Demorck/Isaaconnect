import { Group } from "../Models/Group";
import { Item } from "../Models/Item";

export class Constants {
    static items: Item[] = [];
    static groups: Group[] = [];
    
    static VERSION: string = '1.0.0';

    static get ITEMS() {
        return this.items;
    }

    static set ITEMS(items: Item[]) {
        this.items = items;
    }

    static get GROUPS() {
        return this.groups;
    }

    static set GROUPS(groups: Group[]) {
        this.groups = groups;
    }

    static get URL(): string {
        return 'https://isaaconnect.com';
    }

    static get WIKI(): string {
        return 'https://bindingofisaacrebirth.fandom.com/wiki/';
    }

    static get MAX_HEALTH(): number {
        return 4;
    }

    static get NUMBER_OF_GROUPS(): number {
        return 4;
    }

    static get NUMBER_OF_ITEMS(): number {
        return 4;
    }

    static NUMBER_OF_DAYS_BEFORE: number = 3;

    static BASE_DATE: number = new Date(2024, 6, 11, 0, 0, 0, 0).getTime();

    static COLORS: string[] = ["red-300", "blue-300", "green-300", "yellow-300"];

    static DEFAULT_DATA: any = {
        settings: {
            theme: 'basement-theme',
            autocomplete: false,
            difficulty: 'normal',
            debug: false,
            tts: false,
            link: true
        },
        game: {
            health: Constants.MAX_HEALTH,
            groupsSolved: [],
            attempts: [],
            currentAttempt: 0,
            mapItemAndGroup: new Map(),
            finished: false,
            history: [],
            groupFound: 0
        },
        stats: {
            winStreak: 0,
            longestStreak: 0,
            wins: 0,
            losses: 0,
        },
        lastIsaaconnect: 0,
        version: Constants.VERSION
    };

    static get THEMES(): string[] {
        return [
            "basement-theme",
            "flooded-caves-theme",
            "green-theme",
            "catacombs-theme",
            "ph-theme",
            "depths-theme",
            "dank-depths-theme",
            "mausoleum-theme",
            "gehenna-theme",
            "womb-theme",
            "scarred-womb-theme",
            "dave-theme",
            "corpse-theme",
            "cathedral-theme",
            "sheol-theme",
            "chest-theme",
            "dark-room-theme",
            "void-theme"
        ];
    }

    static get WIN_MESSAGES(): string[] {
        return [
            "!!! DEAD GOD !!!",
            "!! REAL PLATINUM GOD !!",
            "! PLATINUM GOD !",
            "GOLDEN GOD"
        ];
    }

    /////////////////////////////////

    static get ALMOST(): string { return 'Almost...' };
    
    static ALREADY_GUESSED: string = 'Already guessed!';
}
