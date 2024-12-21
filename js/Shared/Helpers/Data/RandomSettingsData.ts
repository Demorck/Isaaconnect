import { Difficulties } from "@/Shared/Models/Enums/Difficulties";

export interface RandomSettingsData {
    bannedTags: boolean;
    checkGrid: boolean;
    
    numberOfGroups: number;
    numberOfItems: number;
    numberOfBlindItems: number;

    randomHealth: number;

    customDifficulty: Difficulties;
}