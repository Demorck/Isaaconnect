import { statsLogic } from './Stats.js';
import { settingsLogic, themeLogic, autocompleteLogic, difficultyLogic, linkCopyLogic, redirectWikiLogic } from './Settings.js';
import { scheduleLogic } from './Schedule.js';
import { addEvent } from './Debug.js';
import { addEventLogs } from './Logs.js';
// import { TTSLogic } from './Accessibility.js';
import { Utils } from '../Shared/Helpers/Utils.js';


export async function displayTooltip(element: HTMLElement, index: number): Promise<void> {
    const wrapper = document.querySelector('#tooltip-wrapper') as HTMLElement;
    const type = element.getAttribute('data-id');
    if (!type) return;

    wrapper.style.display = 'none';
    const isAlreadyActive = document.querySelector('.tooltip-active') as HTMLElement;

    if (wrapper.innerHTML !== '') {
        wrapper.innerHTML = '';
        document.querySelectorAll('.tooltip-active').forEach(el => {
            el.classList.remove('tooltip-active');
            el.classList.add('tooltip-inactive');
            el.classList.remove('shadow-theme');
        });
    }

    if (isAlreadyActive && isAlreadyActive.getAttribute('data-id') === type) {
        isAlreadyActive.classList.remove('tooltip-active');
        isAlreadyActive.classList.add('tooltip-inactive');
        isAlreadyActive.classList.remove('shadow-theme');
        return;
    }

    element.classList.add('tooltip-active');
    element.classList.add('shadow-theme');
    element.classList.remove('tooltip-inactive');

    let html = '';
    html = await Utils.loadHTML(`/include/tooltips/${type}.html`);
    switch (type) {
        case 'stats':
            html = await statsLogic(html);
            break;
        case 'settings':
            html = await settingsLogic(html);
            break;
        default:
            break;
    }

    wrapper.innerHTML = html;
    wrapper.style.display = 'block';
    wrapper.setAttribute('data-id', type);
    wrapper.setAttribute('data-index', index.toString());

    switch (type) {
        case 'settings':
            themeLogic(wrapper);
            autocompleteLogic(wrapper);
            difficultyLogic(wrapper);
            linkCopyLogic(wrapper);
            redirectWikiLogic(wrapper);
            break;
        case 'schedule':
            scheduleLogic();
            break;
        case 'accessibility':
            // TTSLogic(wrapper);
            break;
        case 'debug':
            addEvent(wrapper);
            break;
        case 'logs':
            addEventLogs(wrapper);
            break;
        default:
            break;
    }
}

function hideTooltip(): void {
    const wrapper = document.querySelector('#tooltip-wrapper') as HTMLElement;
    wrapper.style.display = 'none';
    wrapper.innerHTML = '';
    document.querySelectorAll('.tooltip-active').forEach(el => {
        el.classList.remove('tooltip-active');
        el.classList.add('tooltip-inactive');
        el.classList.remove('shadow-theme');
    });
}

export function initializeTooltipListener(): void {
    if (document.readyState === 'complete') {
        const elements = document.querySelectorAll('#tooltip-icons [data-id]');
        elements.forEach((element, index) => {
            element.addEventListener('click', () => {
                displayTooltip(element as HTMLElement, index);
                let el = element as HTMLElement;
            });
        });
    }
}
