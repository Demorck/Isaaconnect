import { Utils } from "../../Helpers/Utils.js";
import { StorageManager } from "../../Helpers/Data/StorageManager.js";

/**
 * @description Display the settings tooltip.
 * @returns {string} The HTML content of the tooltip.
 */
export async function statsLogic(html) {
    let currentIsaaconnect = StorageManager.lastIsaaconnect
    let winStreak = StorageManager.winStreak;
    let longestStreak = StorageManager.longestStreak;
    let wins = StorageManager.wins;
    let losses = StorageManager.losses;

    let placeholders = {
        lastIsaaconnect: currentIsaaconnect,
        winStreak: winStreak,
        longestStreak: longestStreak,
        wins: wins,
        losses: losses
    };

    html = Utils.replacePlaceholders(html, placeholders);

    return html;
}