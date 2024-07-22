import { ChangelogsView } from "../Shared/Views/ChangelogsView.js";

/**
 * @description Adds event listeners for displaying changelogs.
 * @param {HTMLElement} container - The container to which the event listeners will be added.
 */
export function addEventLogs(container: HTMLElement): void {
    const buttons = container.querySelectorAll<HTMLButtonElement>('.button--logs');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const version = button.getAttribute('data-version')!;
            let logs = new ChangelogsView(version);
            logs.showNewChangelogs();
        });
    });
}