"use strict";

const MAX_HEALTH = 4;
let items, groups, health = MAX_HEALTH;
let itemsAlreadyPicked = [], labels = [], groupsSolved = [], attempt = [];
let winStreak = 0, longestStreak = 0, totalWin = 0, totalLose = 0;
let groupAlreadyPicked = [], currentAttempt = 0, mapItemAndGroup = new Map();
let bannedGroup = [], bannedItem = [];
let currentGroup = 0, currentItem = 0;
const colors = ["red-300", "blue-300", "green-300", "purple-300"];

async function fetchData() {
    try {
        const [itemsResponse, groupsResponse] = await Promise.all([
            fetch('/json/items.json'),
            fetch('/json/groups.json')
        ]);

        items = await itemsResponse.json();
        groups = await groupsResponse.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

function getSeed(modifier = 0) {
    const now = new Date();
    if (now.getHours() < 8)
    {
        now.setDate(now.getDate() - 1);
    }
    now.setHours(8, 0, 0, 0);
    return new alea(now.getTime() + modifier).quick();
}

function getRandomGroup(groupAlreadyPicked, bannedGroup) {
    let index = Math.floor(getSeed() * groups.length);
    let group = groups[index], i = 1;

    do {
        index = Math.floor(getSeed(i++) * groups.length);
        group = groups[index];
    } while (groupAlreadyPicked.includes(group.name) || bannedGroup.includes(group));

    groupAlreadyPicked.push(group.name);
    return group;
}

function findItemById(id) {
    return items.find(item => item.id === id);
}

function getRandomItem(group, bannedItem) {
    let indexGroup = Math.floor(getSeed() * group.items.length);
    let item = findItemById(group.items[indexGroup]), i = 1;

    while (itemsAlreadyPicked.includes(item) || bannedItem.includes(item.id)) {
        if (i >= group.items.length)
        {
            groupAlreadyPicked.pop();
            bannedGroup.push(group);
            group = getRandomGroup(groupAlreadyPicked, bannedGroup);
            i = 1;
        }
        indexGroup = Math.floor(getSeed(i++) * group.items.length);
        item = findItemById(group.items[indexGroup]);
    }

    itemsAlreadyPicked.push(item);
    return item;
}

function getRandomItems(group, bannedItem) {
    let items = [];
    let reset = false;
    for (let i = 0; i < 4; i++) {
        let indexGroup = Math.floor(getSeed(i) * group.items.length);
        let item = findItemById(group.items[indexGroup]), j = 1;

        while (itemsAlreadyPicked.includes(item) || bannedItem.includes(item.id)) {
            if (j >= group.items.length)
            {
                groupAlreadyPicked.pop();
                bannedGroup.push(group);
                mapItemAndGroup.forEach((key, value) => {
                    if (key === group) mapItemAndGroup.delete(value);
                });
                itemsAlreadyPicked = itemsAlreadyPicked.filter(item => !group.items.includes(item.id));
                group = getRandomGroup(groupAlreadyPicked, bannedGroup);
                j = 1;
                i = -1;
                items = [];
                reset = true;


                break;
            }
            indexGroup = Math.floor(getSeed(j++) * group.items.length);
            item = findItemById(group.items[indexGroup]);
        }

        if (!reset)
        {

            items.push(item);
            itemsAlreadyPicked.push(item);
            mapItemAndGroup.set(item, group);
        }
        reset = false;
        if (items.length >= 4) break;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateHealthDisplay() {
    const container = document.querySelector('.hearts');
    container.innerHTML = '';
    for (let i = 0; i < health; i++) {
        container.innerHTML += `<img src="/assets/gfx/heart.png" alt="heart" data-type="health">`;
    }
    for (let i = health; i < MAX_HEALTH; i++) {
        container.innerHTML += `<img src="/assets/gfx/empty heart.png" alt="empty heart" data-type="empty">`;
    }
}

function createCard(item, index) {
    let difficulty = localStorage.getItem('difficulty');
    return `<label class="card-module flex-col" data-id="${item.id}">
                <input id="card-${index}" type="checkbox" class="visually-hidden">
                <img src="/assets/gfx/items/collectibles/${numberWithLeadingZeros(item.id)}.png" alt="${item.alias}">
                <span class="card-module--content text-xs sm:text-sm ${difficulty == "normal" ? "hidden" : ""}">${item.alias}</span>
            </label>`;
}

function setupEventListeners() {
    document.querySelectorAll('button[data-id="shuffle"]').forEach(element => element.addEventListener('click', shuffleCards));
    document.querySelector('button[data-id="submit"]').addEventListener('click', handleSubmit);
}

function shuffleCards() {
    const container = document.getElementById("cards-module");
    const labels = Array.from(document.querySelectorAll('.card-module'));
    container.innerHTML = '';
    shuffleArray(labels).forEach(label => container.appendChild(label));
    applyBorderRadius();
}

function applyBorderRadius() {
    const labels = document.querySelectorAll('.card-module');
    labels.forEach((label, index) => {
        label.classList.remove('rounded-tl-3xl');
        label.classList.remove('rounded-tr-3xl');
        label.classList.remove('rounded-bl-3xl');
        label.classList.remove('rounded-br-3xl');
        if (index === 0) label.classList.add('rounded-tl-3xl');
        if (index === 3) label.classList.add('rounded-tr-3xl');
        if (index === labels.length - 4) label.classList.add('rounded-bl-3xl');
        if (index === labels.length - 1) label.classList.add('rounded-br-3xl');
    });

    const solved = document.querySelectorAll('.solved-group');
    solved.forEach((group, index) => {
        group.classList.remove('rounded-tl-3xl');
        group.classList.remove('rounded-tr-3xl');
        group.classList.remove('rounded-bl-3xl');
        group.classList.remove('rounded-br-3xl');
        if (index === 0)
        {
            group.classList.add('rounded-tl-3xl');
            group.classList.add('rounded-tr-3xl');
        }

        if (index === solved.length - 1)
        {
            group.classList.add('rounded-bl-3xl');
            group.classList.add('rounded-br-3xl');
        }
    });

}

function deselectAllCards() {
    document.querySelectorAll('.card-module').forEach(label => {
        label.classList.remove('card-module--selected', 'card-module--disabled');
        label.querySelector('input[type="checkbox"]').disabled = false;
    });

    document.querySelector('button[data-id="submit"]').classList.add('button--disabled');
    document.querySelector('button[data-id="submit"]').disabled = true;
}

function handleSubmit() {
    const selectedItems = document.querySelectorAll('.card-module--selected');
    let firstGroup, currentGroup, win = true, i = 0;

    attempt[currentAttempt] = [];
    let numberOfGroups = 0;
    selectedItems.forEach(item => {
        const id = item.getAttribute('data-id');
        const currentItem = findItemById(parseInt(id));
        currentGroup = mapItemAndGroup.get(currentItem);
        if (!firstGroup) firstGroup = currentGroup;
        else if (firstGroup !== currentGroup) win = false;

        if (firstGroup === currentGroup) numberOfGroups += 1;

        attempt[currentAttempt][i++] = currentGroup.name;
    });

    currentAttempt++;
    if (numberOfGroups == 3)
    {
        showMessage("Almost...");
    }

    if (win) solveGroup(currentGroup);
    else wrongAnswer(selectedItems);

    let difficultyWrapper = document.querySelector('[data-id="difficulty"]');
    if (difficultyWrapper != null)
    {
        difficultyWrapper.classList.add('hidden');
    }

    let autocomplete = localStorage.getItem('autocomplete');
    if (groupsSolved.length >= 3 && autocomplete == 'true') {
        let lastGroup;
        mapItemAndGroup.forEach((key, value) => {
            if (!groupsSolved.includes(key.name))
            {
                lastGroup = key;
            }
        });

        attempt[currentAttempt] = [];
        for (let i = 0; i < 4; i++) {
            attempt[currentAttempt][i] = lastGroup.name;
        }
        solveGroup(lastGroup);
    }

    if (health === 0) {
        mapItemAndGroup.forEach((key, value) => {
            if (!groupsSolved.includes(key.name))
            {
                solveGroup(key);
            }
        });
    }

    
    localStorage.setItem('attempt', attempt);
    localStorage.setItem('currentAttempt', currentAttempt);

    if (groupsSolved.length >= 4) gameOver();
}

function wrongAnswer(selectedItems) {
    health--;
    updateHealthDisplay();
    selectedItems.forEach(item => {
        item.classList.add('card-module--shake');
        setTimeout(() => item.classList.remove('card-module--shake'), 1000);
    });
    
    localStorage.setItem('health', health);
}

function solveGroup(group) {
    const container = document.querySelector(".solved-groups");
    let index = groupAlreadyPicked.indexOf(group.name);
    let content = `<section class="flex flex-row solved-group py-3 rounded-xl font-bold bg-${colors[index]}">
                    <div class="solved-group--cards flex flex-col mr-5">
                        <div class="flex flex-row">`;

    let i = 0;

    mapItemAndGroup.forEach((key, value) => {
        if (key === group) {
            const item = findItemById(value.id);
            if (i == 2) content += `</div><div class="flex flex-row">`;
            content += `<div class="solved-group--card"><img src="/assets/gfx/items/collectibles/${numberWithLeadingZeros(item.id)}.png" alt="${item.alias}"></div>`;
            document.querySelector(`label[data-id="${item.id}"]`).remove();
            i++;
        }
    });

    content += `</div></div>
            <div class="flex flex-1 flex-col items-start"><h3 class="solved-group--title text-lg md:text-xl">${group.name}</h3>
                <p class="solved-group--description text-xs md:text-lg">`;

    i = 0;
    mapItemAndGroup.forEach((key, value) => {
        if (key === group) {
            const item = findItemById(value.id);
            content += `${item.alias}`;
            if (i != 3) content += `, `;
            i++;
        }
    });

    content += `</p></div>`;

    content += `</div></section>`;
    container.innerHTML += content;
    if (!groupsSolved.includes(group.name)) groupsSolved.push(group.name);
    localStorage.setItem('groupsSolved', groupsSolved);
    deselectAllCards();
    applyBorderRadius();
}

function gameOver() {
    const win = health > 0;
    const modalPath = win ? '/modals/win.html' : '/modals/lose.html';
    if (win) {
        winStreak++;
        totalWin++;
        if (winStreak > longestStreak) longestStreak = winStreak;
    }
    else {
        winStreak = 0;
        totalLose++;
    }

    localStorage.setItem('winStreak', winStreak);
    localStorage.setItem('longestStreak', longestStreak);
    localStorage.setItem('wins', totalWin);
    localStorage.setItem('losses', totalLose);

    const shufflesButton = document.querySelectorAll('button[data-id="shuffle"]');
    shufflesButton.forEach(button => button.remove());

    displayModal(modalPath);
    const buttons = document.querySelector('.buttons');
    buttons.innerHTML = '<button data-id="results" class="bg-purple-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">See results</button>';
    document.querySelector('button[data-id="results"]').addEventListener('click', () => displayModal(modalPath));
}

function displayModal(modalPath) {
    const modalWrapper = document.getElementById('modal-wrapper');
    fetch(modalPath)
        .then(response => response.text())
        .then(content => {
            modalWrapper.innerHTML = content;
            document.querySelector('.close-button').addEventListener('click', () => {
                modalWrapper.style.display = 'none';
                modalWrapper.innerHTML = '';
            });
            document.querySelector('[data-id="results-wrapper"]').innerHTML = convertAttemptToSquareMatrix(attempt);
            // document.querySelector('[data-id="results--title"]').innerHTML = `Isaaconnect #${getDaysSince()}`;
        })
        .catch(error => {
            console.error('Erreur lors du chargement du contenu de la modal:', error);
        });

        modalWrapper.style.display = 'flex';
}

function convertAttemptToSquareMatrix(attempt) {
    let content = `<div data-id="results" class="flex flex-col">`;
    attempt.forEach((group, index_attempt) => {
        content += `<div data-id="results-attempt${index_attempt}" class="flex justify-center items-center">`;
        group.forEach((item, index_group) => {
            const index = groupAlreadyPicked.indexOf(item);
            let rounded = index_group % 4 == 0 ? "rounded-l-lg" : index_group % 4 == 3 ? "rounded-r-lg" : "";
            content += `<span data-id="results-attempt${index_attempt}-item${index_group}-group${index}" class="bg-${colors[index]} ${rounded} w-10 h-10"></span>`;
        });
        content += `</div>`;
    });
    content += `</div>`;
    return content;
}

function getDaysSince(startDate = new Date(2024, 4, 24)) {
    const now = new Date();
    startDate.setHours(8, 0, 0, 0);
    const diffTime = Math.abs(now - startDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function init() {
    fetchData().then(() => {
        initDefaultLocalStorage();
        updateHealthDisplay();
        for (let i = 0; i < 4; i++) { 
            currentGroup = getRandomGroup(groupAlreadyPicked, bannedGroup);
            getRandomItems(currentGroup, bannedItem);

            currentGroup.items.forEach(item => {
                if (bannedItem.indexOf(item) === -1) bannedItem.push(item);
                groups.forEach(group => {
                    if (group.items.indexOf(item) !== -1 && bannedGroup.indexOf(group) === -1) bannedGroup.push(group);
                });
            });

        }

        itemsAlreadyPicked = shuffleArray(itemsAlreadyPicked);
        const container = document.getElementById("cards-module");
        itemsAlreadyPicked.forEach((item, index) => container.innerHTML += createCard(item, index));
        applyBorderRadius();

        setupEventListeners();
        addEventCheckBox();
        let lastIsaaconnect = localStorage.getItem('lastIsaaconnect');
        if (lastIsaaconnect != null) {
            if (lastIsaaconnect != getDaysSince()) {
                health = MAX_HEALTH;
                groupsSolved = [];
                localStorage.setItem('health', health);
                localStorage.setItem('groupsSolved', groupsSolved);
                localStorage.setItem('attempt', '');
            } else {
                assignLocalStorageToVariables();
            }
        }
        
        localStorage.setItem('lastIsaaconnect', getDaysSince());
        
    });
}

function assignLocalStorageToVariables() {
    let localHealth = localStorage.getItem('health');
    
    if (localHealth != null) {
        health = parseInt(localHealth);
        updateHealthDisplay();
    }
    else {
        localStorage.setItem('health', health);
    }

    let localGroupSolved = localStorage.getItem('groupsSolved');
    if (localGroupSolved != null && localGroupSolved !== "") {
        groupsSolved = localGroupSolved.split(',');
        groupsSolved.forEach(groupName => {
            const group = groups.find(g => g.name === groupName);
            solveGroup(group);
            mapItemAndGroup.forEach((key, value) => {
                if (groupName === key.name) mapItemAndGroup.delete(value);
            });
        });

        if (groupsSolved.length >= 3) gameOver();
    }

    let localAttempt = localStorage.getItem('attempt');
    if (localAttempt != null) {
        attempt = localAttempt.split(',').reduce((acc, item, index) => {
            const groupIndex = Math.floor(index / 4);
            if (!acc[groupIndex]) acc[groupIndex] = [];
            acc[groupIndex].push(item);
            return acc;
        }, []);
        currentAttempt = attempt.length;
    }

    let theme = localStorage.getItem('theme');
    if (theme != null) {
        document.querySelector('body').classList.add(theme);
    }

    let autocomplete = localStorage.getItem('autocomplete');
    if (autocomplete != null) {
        if (autocomplete == 'true') {
            localStorage.setItem('autocomplete', true);
        }
    }
    else {
        localStorage.setItem('autocomplete', false);
    }
}

function initDefaultLocalStorage() {

    if (document.cookie != null)
        document.cookie = "";

    if (localStorage.getItem('theme') == null)
    {
        localStorage.setItem('theme', 'basement-theme');
        document.querySelector('body').classList.add('basement-theme');
    }
    

    if (localStorage.getItem('autocomplete') == null)
        localStorage.setItem('autocomplete', false);

    if (localStorage.getItem('difficulty') == null)
        localStorage.setItem('difficulty', 'normal');

    if (localStorage.getItem('winStreak') == null)
        localStorage.setItem('winStreak', 0);

    if (localStorage.getItem('longestStreak') == null)
        localStorage.setItem('longestStreak', 0)

    if (localStorage.getItem('wins') == null)
        localStorage.setItem('wins', 0)

    if (localStorage.getItem('losses') == null)
        localStorage.setItem('losses', 0)

    if (localStorage.getItem('theme') != null) {
        if (localStorage.getItem('theme') === 'void-theme') {
            let themes = ["basement-theme", "mausoleum-theme", "flooded-caves-theme", "green-theme", "catacombs-theme", "ph-theme", "depths-theme", "dank-depths-theme", "gehenna-theme", "womb-theme", "scarred-womb-theme", "dave-theme", "corpse-theme", "cathedral-theme", "sheol-theme", "chest-theme", "dark-room-theme"];
            let index = Math.floor(Math.random() * themes.length);
            document.querySelector('body').classList.remove('void-theme');
            document.querySelector('body').classList.add(themes[index]);
        }
    }
    else {
        localStorage.setItem('theme', 'brown-theme');
        document.querySelector('body').classList.add('brown-theme');
    }
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
        });
    });
}

function showMessage(message) {
    const container = document.querySelector('.message');
    container.innerHTML = message;
    container.classList.toggle('hidden');
    setTimeout(() => {
        container.innerHTML = '';
        container.classList.toggle('hidden');
    }, 3000);
}

document.addEventListener("DOMContentLoaded", init);