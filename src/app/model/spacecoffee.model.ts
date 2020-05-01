export enum State {
    IDLE = 'IDLE',
    STARTED = 'STARTED',
    PAUSED = 'PAUSED'
}

export interface Entry {
    start: number;
    end: number;
    pauses: Pause[];
}

export interface Pause {
    start: number;
    end: number;
}