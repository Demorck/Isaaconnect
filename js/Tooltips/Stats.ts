import { Utils } from "../Helpers/Utils.js";
import { StorageManager } from "../Helpers/Data/StorageManager.js";

/**
 * @description Display the settings tooltip.
 * @param {string} html - The HTML content of the tooltip.
 * @returns {Promise<string>} The updated HTML content of the tooltip with placeholders replaced.
 */
export async function statsLogic(html: string): Promise<string> {
    const currentIsaaconnect = StorageManager.lastIsaaconnect;
    const winStreak = StorageManager.winStreak;
    const longestStreak = StorageManager.longestStreak;
    const wins = StorageManager.wins;
    const losses = StorageManager.losses;

    const placeholders = {
        lastIsaaconnect: currentIsaaconnect,
        winStreak: winStreak,
        longestStreak: longestStreak,
        wins: wins,
        losses: losses
    };

    html = Utils.replacePlaceholders(html, placeholders);

    return html;
}
