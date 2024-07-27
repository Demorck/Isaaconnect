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
    numberOfGroups: number;
    /**
     * The number of items in each group.
     */
    numberOfItems: number;
    seeded: boolean;
    blind: boolean;
}