import { Observer } from '../Views/Observer.js';

export class Observable {
    private observers: Observer[] = [];

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: Observer): void {
            const index = this.observers.indexOf(observer);
            if (index > -1) {
                this.observers.splice(index, 1);
            }
    }

    public notifyObservers(data: any = {}): void  {
        this.observers.forEach(observer => observer.update(data));
    }
}