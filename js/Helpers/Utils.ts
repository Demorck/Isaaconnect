import { Constants } from "./Constants.js";
import { StorageManager } from "./Data/StorageManager.js";

declare class alea {
    constructor(seed?: any);
    quick(): number;
}

/**
 * @file Utils.ts
 * @description Some utility functions.
 * @class Utils
 */
export class Utils {

    /**
     * @description Shuffle an array.
     *
     * @static
     * @param {any[]} array
     * @returns {any[]}
     * @memberof Utils
     */
    static shuffleArray(array: any[]): any[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
    * @description Generate a seed based on the current date. Thank's to seedrandom by David Bau.
    * @link https://github.com/davidbau/seedrandom
    *
    * @static
    * @param {number} [modifier=0]
    * @param {number} [daysBefore=0]
    * @returns {number}
    * @memberof Utils
    */
    static getSeed(modifier: number = 0, daysBefore: number = 0): number {
        const now = new Date();
        const seed = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));        
        seed.setUTCDate(seed.getUTCDate() - daysBefore);
        return new alea(seed.getTime() + modifier).quick();
    }

    
    /**
     * @description Get the number of days since a given date.
     *
     * @static
     * @param {number} [startDate=Constants.BASE_DATE]
     * @returns {number}
     */
    static getDaysSince(startDate: number = Constants.BASE_DATE): number {
        const oneDay = 24 * 60 * 60 * 1000;
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));        
        today.setUTCHours(0, 0, 0, 0);
        const diffTime = Math.abs(today.getTime() - startDate);
        return Math.floor(diffTime / oneDay);
    }

    
    /**
     * @description Load an HTML file.
     *
     * @static
     * @async
     * @param {string} file The file to load.
     * @returns {Promise<string>} The HTML content of the file.
     */
    static async loadHTML(file: string): Promise<string> {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        return response.text();
    }
    
    
    /**
     * @description Replace placeholders in an HTML string. Placeholders are in the form of {{ key }}.
     *
     * @static
     * @param {string} html The HTML string.
     * @param {any} variables The variables to replace.
     * @returns {string} The HTML string with the placeholders replaced.
     */
    static replacePlaceholders(html: string, variables: { [key: string]: any }): string {
        return html.replace(/{{\s*([^{}]+)\s*}}/g, (match, expression) => {
            try {
                const func = new Function(...Object.keys(variables), `return ${expression};`);
                return func(...Object.keys(variables).map(key => variables[key]));
            } catch (error) {
                return variables[expression] || match;
            }
        });
    }
    
    

    
    /**
     * @description Add leading zeros to a number.
     *
     * @static
     * @param {number} number The number to add leading zeros to.
     * @param {number} [length=3] The length of the number with zeros.
     * @returns {string} The number with leading zeros.
     */
    static numberWithLeadingZeros(number: number, length: number = 3): string {
        let numStr = number.toString();
        while (numStr.length < length) {
            numStr = '0' + numStr;
        }
        return numStr;
    }

    static resetIfNewVersion() {
        let currentVersion = Constants.VERSION;
        let versionUser = StorageManager.version;
        if (versionUser !== currentVersion) {
            StorageManager.game = Constants.DEFAULT_DATA.game;
            StorageManager.version = currentVersion;
        }
    }

    static sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
