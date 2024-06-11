export class DataFetcher {
    static async fetchData() {
        const items = await DataFetcher.fetchItems();
        const groups = await DataFetcher.fetchGroups();

        return {
            items,
            groups
        };
    }

    static async fetchItems() {
        try {
            const response = await fetch('/json/items.json');
            const items = await response.json();

            return items;

        } catch (error) {
            console.error("Erreur lors de la récupération des items :", error);

            return [];
        }
    }

    static async fetchGroups() {
        try {
            const response = await fetch('/json/groups.json');
            const groups = await response.json();

            return groups;

        } catch (error) {
            console.error("Erreur lors de la récupération des groupes :", error);

            return [];
        }
    }
}