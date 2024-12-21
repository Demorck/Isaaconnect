import { Loader } from "@/Loader";
import { CheckController } from "@/CheckGroup/CheckController";

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();
    
    const listController = new CheckController();
});