import { Utils } from "./Utils.js";

function getTimeRemaining() {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 8, 0, 0, 0);
    const timeRemaining = target - now;
    
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

function updateCountdown() {
    const countdownElement = document.querySelectorAll('.countdown');
    
    const timeRemaining = getTimeRemaining();
    
    countdownElement.forEach(element => {
        element.textContent = `${Utils.numberWithLeadingZeros(timeRemaining.hours, 2)} : ${Utils.numberWithLeadingZeros(timeRemaining.minutes, 2)} : ${Utils.numberWithLeadingZeros(timeRemaining.seconds, 2)}`;
    });
    
    if (timeRemaining.total <= 0) {
        location.reload();
    }
}

export function initializeCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}