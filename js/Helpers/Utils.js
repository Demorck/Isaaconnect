import { Constants } from "./Constants.js";
import { StorageManager } from "./StorageManager.js";

/**
 * @file Utils.js
 * @description Some utility functions.
 * @class Utils
 * @typedef {Utils}
 */
export class Utils {

    /**
     * @description Shuffle an array.
     *
     * @static
     * @param {Array} array
     * @returns {Array}
     * @memberof Utils
     */
    static shuffleArray(array) {
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
    * @returns {number}
    * @memberof Utils
    */
    static getSeed(modifier = 0) {
        const now = new Date();
        if (now.getHours() < 8) {
            now.setDate(now.getDate() - 1);
        }
        now.setHours(8, 0, 0, 0);
        return new alea(now.getTime() + modifier).quick();
    }

    
    /**
     * @description Get the number of days since a given date.
     *
     * @static
     * @param {Date} [startDate=new Date(2024, 4, 24)]
     * @returns {number}
     */
    static getDaysSince(startDate = Constants.BASE_DATE) {
        const oneDay = 24 * 60 * 60 * 1000;
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        return Math.round(diffTime / oneDay);
    }

    
    /**
     * @description Load an HTML file.
     *
     * @static
     * @async
     * @param {string} file The file to load.
     * @returns {string} The HTML content of the file.
     */
    static async loadHtml(file) {
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
     * @param {Map} variables The variables to replace.
     * @returns {string} The HTML string with the placeholders replaced.
     */
    static replacePlaceholders(html, variables) {
        return html.replace(/{{\s*([\w]+)\s*}}/g, (match, key) => {
            return variables[key] !== undefined && variables[key] !== null ? variables[key] : '';
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
    static numberWithLeadingZeros(number, length = 3)
    {
        while (number.toString().length < length)
        {
            number = '0' + number;
        }

        return number;
    }

    static resetIfNewVersion() {
        let currentVersion = Constants.VERSION;
        let versionUser = StorageManager.version;
        if (versionUser !== currentVersion) {
            StorageManager.game = Constants.DEFAULT_DATA.game;
            StorageManager.version = currentVersion;
        }
    }
}