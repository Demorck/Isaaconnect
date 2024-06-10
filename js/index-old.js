"use strict";
let items;
let groups;

async function fetchJson() {
    const responseItems = await fetch('/items.json');
    items = await responseItems.json();

    const responseGroups = await fetch('/groups.json');
    groups = await responseGroups.json();
}

await fetchJson();


const MAX_HEALTH = 5;

var itemsAlreadyPicked = [];
var labels = [];
var groupsSolved = [];
let attempt = [];
let groupAlreadyPicked = [];
let currentAttempt = 0;
let mapItemAndGroup = new Map();
let currentGroup = 0;
let currentItem = 0;

let health = MAX_HEALTH;

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

function getSeed(modifier = 0)
{
    const now = new Date();
    now.setHours(8, 0, 0, 0);

    const seed = now.getTime();
    const rng = new alea(seed + modifier);
    return rng.quick();
}

function getRandomGroup(groupAlreadyPicked)
{

    let index = Math.floor(getSeed() * groups.length);
    let group = groups[index];
    
    let i = 1;
    while (groupAlreadyPicked.includes(group.name))
    {
        index = Math.floor(getSeed(i) * groups.length);
        group = groups[index];
        i++;
    }

    groupAlreadyPicked.push(group.name);
    return group;
}

function findItemById(id)
{
    let item = items.find(item => item.id === id);
    return item;
}

function getRandomItem(group)
{
    let indexGroup = Math.floor(getSeed() * group.items.length);
    let indexItem = group.items[indexGroup];
    let item = findItemById(indexItem);

    let i = 1;
    while (itemsAlreadyPicked.includes(item))
    {
        indexGroup = Math.floor(getSeed(i) * group.items.length);
        indexItem = group.items[indexGroup];
        item = findItemById(indexItem);
        i++;
    }

    itemsAlreadyPicked.push(item);
    return item;
}

function shuffleNodeList(unshuffled)
{
    const shuffled = Array.from(unshuffled);
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(getSeed(i) * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function addEventCheckBox()
{
    const checkboxes = document.querySelectorAll('.card-module input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            let numberOfSelected = document.querySelectorAll('.card-module--selected').length;
            if (numberOfSelected <= 4) {
                checkbox.parentNode.classList.toggle('card-module--selected');
            }
    
            numberOfSelected = document.querySelectorAll('.card-module--selected').length;
            if (numberOfSelected == 4) {
                checkboxes.forEach(otherCheckboxes => {
                    if (!otherCheckboxes.parentNode.classList.contains('card-module--selected')) {
                        otherCheckboxes.parentNode.classList.add('card-module--disabled');
                        otherCheckboxes.disabled = true;
                    }
                });

                
                document.querySelector('button[data-id="submit"]').classList.remove('button--disabled');
                document.querySelector('button[data-id="submit"]').disabled = false;
            }
            else {
                checkboxes.forEach(otherCheckboxes => {
                    otherCheckboxes.parentNode.classList.remove('card-module--disabled');
                    otherCheckboxes.disabled = false;
                });
                
                document.querySelector('button[data-id="submit"]').classList.add('button--disabled');
                document.querySelector('button[data-id="submit"]').disabled = true;
            }

            if (numberOfSelected > 0) {
                document.querySelector('button[data-id="deselect"]').classList.remove('button--disabled');
                document.querySelector('button[data-id="deselect"]').disabled = false;
            }
            else {
                document.querySelector('button[data-id="deselect"]').classList.add('button--disabled');
                document.querySelector('button[data-id="deselect"]').disabled = true;
            }
        });
    });
}

function solveGroup(group)
{
    let container = document.querySelector(".solved-groups");
    let string = '';
    string += `<section class="solved-group">
    <h3 class="solved-group--title">` + group.name + `</h3>
    <ol class="solved-group--cards">`;
    mapItemAndGroup.forEach((key, value) => {
        if (key == group)
        {
            let item = findItemById(value.id);
            string += `<li class="solved-group--card"><img src="/assets/gfx/items/collectibles/` + numberWithLeadingZeros(item.id) + `.png" alt="` + item.alias + `">
            ` + item.alias + `</li>`;
            document.querySelector(`label[data-id="` + item.id + `"]`).remove();
        }
    });
    string += `</ol>
    </section>`;

    container.innerHTML += string;
    if (!groupsSolved.includes(group.name))
        groupsSolved.push(group.name);
    Cookies.set('groupsSolved', groupsSolved);
    document.querySelector('button[data-id="deselect"]').click();
}


docReady(() => {
    for (let i = 0; i < MAX_HEALTH; i++) {
        let container = document.querySelector('.hearts');
        container.innerHTML += `<img src="/assets/gfx/heart.png" alt="heart" data-type="health">`;
    }

    

    for (let i = 0; i < 4; i++)
    { 
        currentGroup = getRandomGroup(groupAlreadyPicked);
        for (let j = 0; j < 4; j++)
        {
            currentItem = getRandomItem(currentGroup);
            mapItemAndGroup.set(currentItem, currentGroup);
        }
    }

    itemsAlreadyPicked = shuffleNodeList(itemsAlreadyPicked);

    itemsAlreadyPicked.forEach((item, index) => {
        let container = document.getElementById("cards-module");
        labels.push()
        
        container.innerHTML += 
        `<label class="card-module" data-id="` + item.id + `">
            <input id="card-` + index + `" type="checkbox" class="visually-hidden">
            <img src="/assets/gfx/items/collectibles/` + numberWithLeadingZeros(item.id) + `.png" alt="` + item.alias + `">
            ` + item.alias + `
        </label>`;
    });

    addEventCheckBox();
    assignCookiesToVariables();

    document.querySelector('button[data-id="shuffle"]').addEventListener('click', () => {
        let labels = document.querySelectorAll('.card-module');
        labels = shuffleNodeList(labels);
        let container = document.getElementById("cards-module");
        container.innerHTML = '';
        labels.forEach(label => {
            container.appendChild(label);
        });
    });

    document.querySelector('button[data-id="deselect"]').addEventListener('click', () => {
        let labels = document.querySelectorAll('.card-module');
        labels.forEach(label => {
            label.classList.remove('card-module--selected');
            label.classList.remove('card-module--disabled');
            label.querySelector('input[type="checkbox"]').disabled = false;
        });
    });

    document.querySelector('button[data-id="submit"]').addEventListener('click', () => {
        let selectedItems = document.querySelectorAll('.card-module--selected');
        let firstGroup;
        let currentGroup;
        let win = true;
        let i = 0;
        attempt[currentAttempt] = [];
        selectedItems.forEach(item => {
            let id = item.getAttribute('data-id');
            let currentItem = findItemById(parseInt(id));
            currentGroup = mapItemAndGroup.get(currentItem);
            if (firstGroup == null)
            {
                firstGroup = mapItemAndGroup.get(currentItem);
            }
            else if (firstGroup != currentGroup)
            {
                win = false;
            }

            attempt[currentAttempt][i] = currentGroup.name;
            i++;
        });

        currentAttempt++;
        Cookies.set('attempt', attempt);
        Cookies.set('currentAttempt', currentAttempt);

        if (win)
        {
            solveGroup(currentGroup);
        }
        else
        {
            wrongAnwser(selectedItems);
        }
        
        if (health == 0) {
            mapItemAndGroup.forEach((key, value) => {
                if (!groupsSolved.includes(key.name)) {
                    solveGroup(key);
                }
            });
        }

        if (groupsSolved.length == 3) {
            mapItemAndGroup.forEach((key, value) => {
                if (!groupsSolved.includes(key.name)) {
                    solveGroup(key);
                }
            });
        }

        if (groupsSolved.length == 4) {
            gameOver();
        }

    });

    if (groupsSolved.length == 4) {
        gameOver();
    }

});

function wrongAnwser(selectedItems) {
    health--;
    let healths = document.querySelectorAll('[data-type="health"]');
    let lastHealth = healths[healths.length - 1];
    lastHealth.src = "/assets/gfx/empty heart.png";
    lastHealth.setAttribute('data-type', 'empty');
    selectedItems.forEach(item => {
        item.classList.add('card-module--shake');
        setTimeout(() => {
            item.classList.remove('card-module--shake');
        }, 1000);
    });

    Cookies.set('health', health);
}

function assignCookiesToVariables() {
    const cookies = Cookies.get();

    if (cookies.health != null) {
        health = cookies.health;
        let healths = document.querySelectorAll('[data-type="health"]');
        for (let i = 1; i <= MAX_HEALTH - health; i++) {
            let lastHealth = healths[healths.length - i];
            lastHealth.src = "/assets/gfx/empty heart.png";
            lastHealth.setAttribute('data-type', 'empty');
        }
    }

    if (cookies.groupsSolved != null) {
        groupsSolved = cookies.groupsSolved.split(',');
        groupsSolved.forEach(group => {
            let groupSolved = groups.find(g => g.name == group);
            solveGroup(groupSolved);
            mapItemAndGroup.forEach((key, value) => {
                if (group == key.name) {
                    mapItemAndGroup.delete(value);
                }
            });
        });
    }

    if (cookies.attempt != null) {
        let array = cookies.attempt.split(',');
        currentAttempt = array.length / 4;
        attempt = [];
        for (let i = 0; i < array.length; i++) {
            if (i % 4 == 0) {
                attempt.push([]);
            }
            attempt[Math.floor(i / 4)][i % 4] = array[i];
        }
    }
}

function gameOver()
{
    let win = health > 0 ? true : false;
    document.getElementById('modal-wrapper').classList.add('modal--show');
    let path;
    if (win)
    {
        path = '/modals/win.html';
    }
    else
    {
        path = '/modals/lose.html';
    }

    afficher_modal(path);
    let buttons = document.querySelector('.buttons');
    buttons.innerHTML = '<button data-id="results" class="bg-purple-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Voir les résultats</button>';
    document.querySelector('button[data-id="results"]').addEventListener('click', () => {
        afficher_modal(path);
    });
}

function afficher_modal(modalPath) {
    let modalWrapper = document.getElementById('modal-wrapper');

    fetch(modalPath)
        .then(response => response.text())
        .then(content => {
            modalWrapper.innerHTML = content;
            document.querySelector('.close').addEventListener('click', () => {
                modalWrapper.style.display = 'none';
            });
            let results = convertAttemptToSquareMatrix(attempt);
            document.querySelector('[data-id="result"]').innerHTML = results;
            document.querySelector('[data-id="result--title"]').innerHTML = `Isaaconnect #${getDaySince()}`;
        })
        .catch(error => {
            console.error('Erreur lors du chargement du contenu de la modal:', error);
        });

    modalWrapper.style.display = 'flex';
}

function convertAttemptToSquareMatrix(attempt)
{
    let matrix = [];
    let i = 0;
    let j = 0;
    let content = `<div class="flex flex-col gap-4">`;
    attempt.forEach(group => {
        matrix[i] = [];
        content += `<div class="flex justify-center items-center">`;
        group.forEach(item => {
            matrix[i][j] = groupAlreadyPicked.indexOf(item);
            switch (groupAlreadyPicked.indexOf(item))
            {
                case 0:
                    content += `<span class="bg-red-300 rounded-md w-10 h-10"></span>`;
                    break;
                case 1:
                    content += `<span class="bg-blue-300 rounded-md w-10 h-10"></span>`;
                    break;
                case 2:
                    content += `<span class="bg-green-300 rounded-md w-10 h-10"></span>`;
                    break;
                case 3:
                    content += `<span class="bg-purple-300 rounded-md w-10 h-10"></span>`;
                    break;
            }
            j++;
        });
        i++;
        content += `</div>`;
        j = 0;
    });
    content += `</div>`;

    return content;
}

function getDaySince(startDate = new Date(2024, 4, 24)) {
    const now = new Date();
    
    const diffTime = Math.abs(now - startDate);
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}
