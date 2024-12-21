import { ItemData } from "@/Shared/Helpers/Data/ItemData";

export interface GroupData {
    name: string;
    items: ItemData[];
    difficulty: number;
    tags: string[];
    index: number;
} 

export interface GroupJSONData {
    name: string;
    items: number[];
    difficulty: number;
    tags: string[];
}