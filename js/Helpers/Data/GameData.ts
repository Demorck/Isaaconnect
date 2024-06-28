export interface GameData {
    health: number;
    groupsSolved: any[];
    attempts: any[];
    currentAttempt: number;
    history: any[];
    mapItemAndGroup: Map<any, any>;
    finished: boolean;
}