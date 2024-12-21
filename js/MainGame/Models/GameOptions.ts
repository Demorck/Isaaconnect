import { Difficulties } from "@/Shared/Models/Enums/Difficulties";

/**
 * Description placeholder
 *
 * @export
 * @interface GameOptions
 * @typedef {GameOptions}
 */
export interface GameOptions {
    /**
     * The number of groups in the game.
     */
    NUMBER_OF_GROUPS: number;
    /**
     * The number of items in each group.
     */
    NUMBER_OF_ITEMS: number;

    /**
     * If the game is seeded
     */
    SEEDED: boolean;

    /**
     * Health 
     */
    HEALTH: number  ;

    /**
     * If the game should be blind
     */
    NUMBER_OF_BLIND_ITEMS: number;

    /**
     * If the game should have banned tags
     */
    TAGS_BANNED: boolean;

    
    /**
     * Check the grid if it's impossible
     */
    CHECK_GRID: boolean;

    /**
     * The custom difficulty
     */
    CUSTOM_DIFFICULTY: Difficulties;

    
}