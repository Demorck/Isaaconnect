import { Utils } from "./Utils.js";

interface TimeRemaining {
    total: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function getTimeRemaining(): TimeRemaining {
    const now = new Date();
    const target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
    const timeRemaining = target.getTime() - now.getTime();
    
    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / 1000 / 60) % 60);
    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    
    return {
        total: timeRemaining,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}

function updateCountdown(): void {
    const countdownElements = document.querySelectorAll<HTMLElement>('.countdown');
    
    const timeRemaining = getTimeRemaining();
    
    countdownElements.forEach(element => {
        element.textContent = `${Utils.numberWithLeadingZeros(timeRemaining.hours, 2)} : ${Utils.numberWithLeadingZeros(timeRemaining.minutes, 2)} : ${Utils.numberWithLeadingZeros(timeRemaining.seconds, 2)}`;
    });
    
    if (timeRemaining.total <= 0) {
        location.reload();
    }
}

export function initializeCountdown(): void {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}
