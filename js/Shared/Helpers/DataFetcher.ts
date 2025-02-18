import { Constants } from "@/Shared/Helpers/Constants";

export class DataFetcher {
    static async fetchData(): Promise<{ items: any[], groups: any[] }> {
        const items = await DataFetcher.fetchItems();
        const groups = await DataFetcher.fetchGroups();

        return {
            items,
            groups
        };
    }

    static async fetchItems(): Promise<any[]> {
        try {
            const response = await fetch(Constants.ITEMS_PATH);
            const items = await response.json();

            return items;
        } catch (error) {
            console.error("Erreur lors de la récupération des items :", error);
            return [];
        }
    }

    static async fetchGroups(): Promise<any[]> {
        try {
            const response = await fetch(Constants.GROUPS_PATH);
            const groups = await response.json();
            
            return groups;
        } catch (error) {
            console.error("Erreur lors de la récupération des groupes :", error);
            return [];
        }
    }
}
