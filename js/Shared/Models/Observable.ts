import { Observer } from "@/Shared/Views/Observer";

export class Observable {
    private observers: Observer[] = [];

    public addObserver(observer: Observer, unique: boolean = false): void {
        if (unique) this.observers = [];
        this.observers.push(observer);
    }

    public removeObserver(observer: Observer): void {
            const index = this.observers.indexOf(observer);
            if (index > -1) {
                this.observers.splice(index, 1);
            }
    }

    public notifyObservers(data: any = {}): void  {
        if (this.observers.length > 2) throw new Error("");
        
        this.observers.forEach(observer => observer.update(data));
    }
}