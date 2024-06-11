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
    static getDaysSince(startDate = new Date(2024, 4, 24)) {
        const oneDay = 24 * 60 * 60 * 1000;
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        return Math.round(diffTime / oneDay);
    }
}