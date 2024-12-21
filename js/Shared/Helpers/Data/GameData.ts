import { GroupData } from "@/Shared/Helpers/Data/GroupData";
import { ItemData } from "@/Shared/Helpers/Data/ItemData";

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