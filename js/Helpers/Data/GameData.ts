import { GroupData } from "./GroupData.js";
import { ItemData } from "./ItemData.js";

export interface GameData {
    health: number;
    groupsSolved: GroupData[];
    attempts: GroupData[][];
    currentAttempt: number;
    history: ItemData[][];
    mapItemAndGroup: Map<any, any>;
    finished: boolean;
    groupFound: number;
}