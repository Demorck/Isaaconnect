import { Loader } from "@/Loader";
import { StorageManager } from "@/Shared/Helpers/Data/StorageManager";

let WIN_STREAK  = 193;
let LONGEST     = 193;
let TOTAL_W     = 196;
let TOTAL_L     = 1;


document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();
    
    await Loader.loadComplete();

    populateElements();

    let btn = document.getElementById("retrieve");
    btn?.addEventListener("click", () => retrieveElements());
});

function retrieveElements()
{
    let winStreak = document.getElementById("winStreak")!;
    let longest = document.getElementById("longest")!;
    let totalW = document.getElementById("totalW")!;
    let totalL = document.getElementById("totalL")!;

    StorageManager.winStreak = WIN_STREAK;
    StorageManager.longestStreak = LONGEST;
    StorageManager.wins = TOTAL_W;
    StorageManager.losses = TOTAL_L;

    winStreak.innerText = StorageManager.winStreak.toString();
    longest.innerText = StorageManager.longestStreak.toString();
    totalW.innerText = StorageManager.wins.toString();
    totalL.innerText = StorageManager.losses.toString();
}

function populateElements()
{
    let winStreak = document.getElementById("winStreak")!;
    let longest = document.getElementById("longest")!;
    let totalW = document.getElementById("totalW")!;
    let totalL = document.getElementById("totalL")!;

    winStreak.innerText = StorageManager.winStreak.toString();
    longest.innerText = StorageManager.longestStreak.toString();
    totalW.innerText = StorageManager.wins.toString();
    totalL.innerText = StorageManager.losses.toString();
}