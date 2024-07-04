/**
 * Observer interface for the observer pattern
 */
export interface Observer {
    update: (data: any | null) => void;
}