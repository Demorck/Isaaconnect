import { ItemData } from "./ItemData.js";

export interface GroupData {
    name: string;
    items: ItemData[];
    difficulty: number;
    index: number;
} 