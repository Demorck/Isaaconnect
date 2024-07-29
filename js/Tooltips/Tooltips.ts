import { statsLogic } from './Stats.js';
import { settingsLogic, themeLogic, autocompleteLogic, difficultyLogic, linkCopyLogic, redirectWikiLogic } from './Settings.js';
import { scheduleLogic } from './Schedule.js';
import { addEvent } from './Debug.js';
import { addEvent as addRandomSettingsEvent } from './RandomSettings.js';
import { addEventLogs } from './Logs.js';
// import { TTSLogic } from './Accessibility.js';
import { Utils } from '../Shared/Helpers/Utils.js';


export async function displayTooltip(element: HTMLElement): Promise<void> {
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
    switch (type) {
        case 'stats':
            html = await Utils.loadHTML('/include/tooltips/stats.html');
            html = await statsLogic(html);
            break;
        case 'help':
            html = await Utils.loadHTML('/include/tooltips/help.html');
            break;
        case 'settings':
            html = await Utils.loadHTML('/include/tooltips/settings.html');
            html = await settingsLogic(html);
            break;
        case 'promo':
            html = await Utils.loadHTML('/include/tooltips/promo.html');
            break;
        case 'schedule':
            html = await Utils.loadHTML('/include/tooltips/schedule.html');
            break;
        case 'accessibility':
            html = await Utils.loadHTML('/include/tooltips/accessibility.html');
            break;
        case 'debug':
            html = await Utils.loadHTML('/include/tooltips/debug.html');
            break;  
        case 'random-settings':
            html = await Utils.loadHTML('/include/tooltips/random_settings.html');
            break;
        case 'logs':
            html = await Utils.loadHTML('/include/tooltips/logs.html');
            break;
        default:
            break;
    }

    wrapper.innerHTML = html;
    wrapper.style.display = 'block';
    wrapper.setAttribute('data-id', type);

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
        case 'random-settings':
            addRandomSettingsEvent(wrapper)
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
        elements.forEach(element => {
            element.addEventListener('click', () => {
                displayTooltip(element as HTMLElement);
                let el = element as HTMLElement;
            });
        });
    }
}
