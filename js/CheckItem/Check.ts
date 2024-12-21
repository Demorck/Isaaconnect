import { Loader } from "@/Loader";
import { CheckController } from "@/CheckItem/CheckController";

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();
    
    const listController = new CheckController();
});