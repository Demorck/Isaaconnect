import { Constants } from "@/Shared/Helpers/Constants";
import { Loader } from "@/Loader";
import { Difficulties } from "@/Shared/Models/Enums/Difficulties";

document.addEventListener('DOMContentLoaded', async () => {
    await Loader.load();
    let numberOfGroups = Constants.GROUPS.length;
    let meanItems = meanf(Constants.GROUPS.map((group) => group.getItems().length));
    let sd = dev(Constants.GROUPS.map((group) => group.getItems().length));
    let meanItemsByDifficulty = new Map<Difficulties, number>();
    meanItemsByDifficulty.set(0, meanf(Constants.GROUPS.filter((group) => group.getDifficulty() === 0).map((group) => group.getItems().length)));
    meanItemsByDifficulty.set(1, meanf(Constants.GROUPS.filter((group) => group.getDifficulty() === 1).map((group) => group.getItems().length)));
    meanItemsByDifficulty.set(2, meanf(Constants.GROUPS.filter((group) => group.getDifficulty() === 2).map((group) => group.getItems().length)));
    meanItemsByDifficulty.set(3, meanf(Constants.GROUPS.filter((group) => group.getDifficulty() === 3).map((group) => group.getItems().length)));

    // console.log(`Number of groups: ${numberOfGroups}`);
    // console.log(`Mean number of items: ${meanItems}`);
    // console.log(`Standard deviation: ${sd}`);
    // console.log(Constants.GROUPS.map((group) => group.getItems().length));
    // console.log(Constants.GROUPS);
    
    // console.log(meanItemsByDifficulty);

    
    let ul = document.createElement('ul');
    ul.classList.add('list-group');
    
    let li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `Number of groups: ${numberOfGroups}`;
    ul.appendChild(li);

    li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `Mean number of items: ${meanItems.toPrecision(3)}`;
    ul.appendChild(li);

    li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `Standard deviation: ${sd.toPrecision(3)}`;
    ul.appendChild(li);
    
    let wrapper = document.querySelector('#stats-wrapper')!;
    wrapper.appendChild(ul);

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
   return Math.sqrt(variance)
  }