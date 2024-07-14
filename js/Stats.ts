import { Constants } from './Helpers/Constants.js';
import { Loader } from './Loader.js';
import { Stats } from './Models/Stats/Stats.js';

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();
    let time = performance.now();

    let bigMap = new Map<string, number>();
    let numberOfGeneration = 10000;
    let times = 5;
    let numberCalled = 0;
    let getTotalOccurence = 0;
    let ImpossibleGridFound = 0;

    for (let i = 0; i < times; i++) {
        let stats = new Stats(numberOfGeneration);
        try {
            stats.generateOccurenceGroup();
        } catch (error) {
            console.log("Stop after " + stats.getNumberOfGameCalled() + " games.");
            console.error(error);
        } finally {
            let occurenceGroup = stats.getOccurenceGroup();
            for (let [key, value] of occurenceGroup) {
                let occurence = bigMap.get(key);
                if (occurence) {
                    bigMap.set(key, occurence + value);
                } else {
                    bigMap.set(key, value);
                }
            }
            numberCalled += stats.getNumberOfGameCalled();
            ImpossibleGridFound += stats.getNumberOfImpossibleGridFound();            
        }
    }

    let delta = performance.now() - time;
    
    bigMap = new Map([...bigMap].sort((a, b) => b[1] - a[1]));
    
    let wrapper = document.getElementById("stats-wrapper")!;
    let table = document.createElement("table");
    table.classList.add("table", "bg-white");
    table.classList.add("table-striped");
    table.classList.add("table-bordered");
    table.classList.add("table-hover");
    table.classList.add("table-sm");
    table.classList.add("table-responsive");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.textContent = "Group";
    tr.appendChild(th);
    th = document.createElement("th");
    th.textContent = "Difficulty";
    tr.appendChild(th);
    th = document.createElement("th");
    th.textContent = "Occurence";
    tr.appendChild(th);
    thead.appendChild(tr);
    table.appendChild(thead);
    for (let [key, value] of bigMap) {
        tr = document.createElement("tr");
        let td = document.createElement("td");
        td.textContent = key;
        tr.appendChild(td);
        td = document.createElement("td");
        td.textContent = value.toString();
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrapper.appendChild(table);

    let moyenne = numberCalled * 4 / Constants.GROUPS.length;
    let ecartType = dev(Array.from(bigMap.values()));
    let meanfound = meanf(Array.from(bigMap.values()));    
    console.log("Temps : " + delta + " ms");
    
    console.log("Nombre de générations : " + numberOfGeneration);
    console.log("Nombre de fois appelé : " + numberCalled);
    console.log("Impossible grid : " + ImpossibleGridFound);

    console.log("Nombre de fois : " + times);
    console.log("Nombre de groupes : " + Constants.GROUPS.length);
    console.log("Moyenne cherchée: " + moyenne);
    console.log("Écart type : " + ecartType);
    console.log("Coefficiant de variation : " + 100 * ecartType / moyenne);

});

function meanf(arr: number[]): number {
    return arr.reduce((acc, curr) => acc + curr, 0) / arr.length;
}

function dev(arr: number[]): number {
    // Creating the mean with Array.reduce
    let mean = meanf(arr);
     
    // Assigning (value - mean) ^ 2 to every array item
    arr = arr.map((k)=>{
      return (k - mean) ** 2
    })
     
    // Calculating the sum of updated array
   let sum = arr.reduce((acc, curr)=> acc + curr, 0);
    
   // Calculating the variance
   let variance = sum / arr.length
    
   // Returning the Standered deviation
   return Math.sqrt(sum / arr.length)
  }