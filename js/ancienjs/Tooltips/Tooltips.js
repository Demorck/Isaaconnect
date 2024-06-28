import { statsLogic } from './Stats.js';
import { settingsLogic, themeLogic, autocompleteLogic, difficultyLogic, linkCopyLogic } from './Settings.js';
import { scheduleLogic } from './Schedule.js';
import { addEvent } from './Debug.js';
import { TTSLogic } from './Accessibility.js';
import { Utils } from '../../Helpers/Utils.js';

export async function displayTooltip(element) {
    let wrapper = document.querySelector('#tooltip-wrapper');
    let type = element.getAttribute('data-id');
    wrapper.style.display = 'none';
    let isAlreadyActive = document.querySelector('.tooltip-active');
    if (wrapper.innerHTML !== '')
    {
        wrapper.innerHTML = '';
        document.querySelectorAll('.tooltip-active').forEach(element => {
            element.classList.remove('tooltip-active');
            element.classList.add('tooltip-inactive');
            element.classList.remove('shadow-theme');
        });
    }
    
    if (isAlreadyActive != null && isAlreadyActive.getAttribute('data-id') === type)
    {
        isAlreadyActive.classList.remove('tooltip-active');
        isAlreadyActive.classList.add('tooltip-inactive');
        isAlreadyActive.classList.remove('shadow-theme');
        return;
    }


    element.classList.add('tooltip-active');
    element.classList.add('shadow-theme');
    element.classList.remove('tooltip-inactive');

    let html = '';
    switch (type)
    {
        case 'stats':
            html = await Utils.loadHtml('/include/tooltips/stats.html');
            html = await statsLogic(html);
            break;
        case 'help':
            html = await Utils.loadHtml('/include/tooltips/help.html');
            break;
        case 'settings':
            html = await Utils.loadHtml('/include/tooltips/settings.html');
            html = await settingsLogic(html);
            break;
        case 'promo':
            html = await Utils.loadHtml('/include/tooltips/promo.html');
            break;
        case 'schedule':
            html = await Utils.loadHtml('/include/tooltips/schedule.html');
            break;
        case 'accessibility':
            html = await Utils.loadHtml('/include/tooltips/accessibility.html');
            break;
        case 'debug':
            html = await Utils.loadHtml('/include/tooltips/debug.html');
            break;
        default:
            break;
    }

    wrapper.innerHTML = html;
    wrapper.style.display = 'block';
    wrapper.setAttribute('data-id', type);

    switch (type)
    {
        case 'settings':
            themeLogic(wrapper);
            autocompleteLogic(wrapper);
            difficultyLogic(wrapper);
            linkCopyLogic(wrapper);
            break;
        case 'schedule':
            scheduleLogic();
            break;
        case 'accessibility':
            TTSLogic(wrapper);
            break;
        case 'debug':
            addEvent(wrapper);
            break;
        default:
            break;
    }
}

function hideTooltip() {
    let wrapper = document.querySelector('#tooltip-wrapper');
    wrapper.style.display = 'none';
    wrapper.innerHTML = '';
    document.querySelectorAll('.tooltip-active').forEach(element => {
        element.classList.remove('tooltip-active');
        element.classList.add('tooltip-inactive');
        element.classList.remove('shadow-theme');
    });
}

export function initializeTooltipListener()
{
    if (document.readyState === 'complete')
    {
        const elements = document.querySelectorAll('#tooltip-icons [data-id]');
        elements.forEach(element => {
            element.addEventListener('click', () => {
                displayTooltip(element)
            });
        });
    }
}
