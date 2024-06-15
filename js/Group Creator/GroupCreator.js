import { Constants } from "../Helpers/Constants.js";
import { DataFetcher } from "../Helpers/DataFetcher.js";
import { Group } from "./Group.js";
import { Item } from "./Item.js";

export class GroupCreator {
    constructor() {
        this.groups = [];
        this.selectedGroup = null;
        this.selectedItem = null;
        this.init();
    }

    async init() {
        const {items, groups} = await DataFetcher.fetchData();
        Constants.ITEMS = items;
        Constants.GROUPS = groups;

        let wrapper = document.getElementById('groups-wrapper');
        Constants.GROUPS.forEach((group, index) => {
            let currentGroup = new Group(group);
            this.groups.push(currentGroup);
            let element = currentGroup.getGroupElement();
            element.addEventListener('click', this.toggleItems.bind(this, currentGroup));
            wrapper.appendChild(currentGroup.getGroupElement());
        });

        this.addEventListeners();
    }

    addEventListeners() {
        let filter = document.getElementById('filter-input');
        filter.addEventListener('input', this.filterGroups.bind(this));

        let addGroup = document.getElementById('add-group');
        addGroup.addEventListener('click', this.addGroup.bind(this));
        
        let removeGroup = document.getElementById('delete-group');
        removeGroup.addEventListener('click', this.removeGroup.bind(this));

        let addItem = document.getElementById('add-item');
        addItem.addEventListener('click', this.addItem.bind(this));
        
        let removeItem = document.getElementById('delete-item');
        removeItem.addEventListener('click', this.removeItem.bind(this));
        
        let generate = document.getElementById('generate');
        generate.addEventListener('click', this.generate.bind(this));
    }

    filterGroups(event) {
        let filter = event.target.value.toLowerCase().trim();
        this.groups.forEach(group => {
            let groupName = group.name.toLowerCase();
            if (groupName.includes(filter)) {
                group.getGroupElement().style.display = 'block';
            } else {
                group.getGroupElement().style.display = 'none';
            }
        });
    }

    toggleItems(group) {
        document.getElementById('items-wrapper').innerHTML = '';
        document.querySelectorAll('.group').forEach(group => {
            group.classList.remove('selected');
        });
        let items = group.items;
        this.selectedGroup = group;
        group.getGroupElement().classList.add('selected');
        items.forEach(item => {
            let itemElement = item.getItemElement();
            itemElement.addEventListener('click', () => {
                document.querySelectorAll('.item.selected').forEach(item => {
                    item.classList.remove('selected');
                });
                itemElement.classList.add('selected');
                this.selectedItem = item;
            });
            document.getElementById('items-wrapper').appendChild(itemElement);
        });
    }

    addGroup() {
        let newGroup = {
            name: 'Nouveau groupe',
            items: []
        };

        Constants.GROUPS.push(newGroup);
        let group = new Group(newGroup);
        this.groups.push(group);
        let element = group.getGroupElement();
        element.addEventListener('click', this.toggleItems.bind(this, group));
        document.getElementById('groups-wrapper').appendChild(group.getGroupElement());
    }

    removeGroup() {
        if (this.selectedGroup) {
            let index = Constants.GROUPS.indexOf(this.selectedGroup.group);
            Constants.GROUPS.splice(index, 1);
            this.groups.splice(index, 1);
            this.selectedGroup.getGroupElement().remove();
            this.selectedGroup = null;
            document.getElementById('items-wrapper').innerHTML = '';
        }
    
    }

    addItem() {

    }

    removeItem() {
        if (this.selectedItem && this.selectedGroup) {
            let index = this.selectedGroup.items.indexOf(this.selectedItem);
            this.selectedGroup.items.splice(index, 1);
            this.selectedItem.getItemElement().remove();
            document.querySelector('#items-wrapper [data-id="' + this.selectedItem.id + '"]').remove();
            this.selectedItem = null;
        }
    }

    generate() {
        let groups = [];
        this.groups.forEach(group => {
            let items = [];
            group.items.forEach(item => {
                items.push(item.id);
            });
            groups.push({
                name: group.name,
                items: items,
                difficulty: group.difficulty
            });
        });

        let data = JSON.stringify(groups, null, 2);
        data = data.replace(/^\s*([0-9]*,?)*\n/gm, '$1 ').replace(/(: \[)\n/gm, '$1');
        
        let code = document.getElementById('code');
        code.innerHTML = data;

        if (code.classList.contains('hidden')) {
            code.classList.remove('hidden');
        }

        if (navigator.clipboard) {
            navigator.clipboard.writeText(data);
        }
    }

    syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const groupCreator = new GroupCreator();
});