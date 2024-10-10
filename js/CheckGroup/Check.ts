import { Loader } from "../Loader.js";
import { CheckController } from "./CheckController.js";

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();
    
    const listController = new CheckController();
});