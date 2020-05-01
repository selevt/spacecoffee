import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { State, Pause, Entry } from '../model/spacecoffee.model';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { __values } from 'tslib';

@Injectable({
    providedIn: 'root'
})
export class Store {
    private initialState: AppState = {
        state: State.IDLE,
        startTime: null,
        pauseTime: null,
        pauses: [],
        history: []
    };

    private valueSubj: BehaviorSubject<AppState> = new BehaviorSubject<AppState>(this.initialState);

    constructor() {
        this.valueSubj.next(this.loadState());
        this.valueSubj.subscribe(newState => {
            this.saveState(newState);
        });
    }

    get latestValues() {
        return this.valueSubj.value;
    }
    get value() {
        return this.valueSubj.asObservable();
    }

    // peristence

    private saveState(appState: AppState) {
        localStorage.setItem('history', JSON.stringify(appState.history));
        localStorage.setItem('pauses', JSON.stringify(appState.pauses));
        localStorage.setItem('state', appState.state.toString());
        localStorage.setItem('startTime', appState.startTime ? appState.startTime.toString() : null);
        localStorage.setItem('pauseTime', appState.pauseTime ? appState.pauseTime.toString() : null);
    }
    private loadState(): AppState {
        const res: AppState = {...this.initialState};

        const hist = localStorage.getItem('history');
        if (hist) {
            const histJson = JSON.parse(hist);
            if (Array.isArray(histJson)) {
                res.history = histJson;
            }
        }
        const pauses = localStorage.getItem("pauses");
        if (pauses) {
            const pausesJson = JSON.parse(pauses);
            if (Array.isArray(pausesJson)) {
                res.pauses = pausesJson;
            }
        }
        const state = localStorage.getItem("state");
        if (state) {
            res.state = State[state];
        }
        const startTime = localStorage.getItem("startTime");
        if (startTime) {
            res.startTime = parseInt(startTime);
        }
        const pauseTime = localStorage.getItem("pauseTime");
        if (pauseTime) {
            res.pauseTime = parseInt(pauseTime);
        }

        return res;
    }

    // actions

    public importState(imp: string) {
        const history = JSON.parse(imp);
        if (!Array.isArray(history)) {
            console.log('invalid import data');
            return;
        }

        this.valueSubj.next({
            ...this.initialState,
            history
        });
    }

    public startTimer() {
        this.valueSubj.next({
            ...this.valueSubj.value,
            state: State.STARTED,
            startTime: this.now()
        });
    }

    public pauseTimer() {
        this.valueSubj.next({
            ...this.valueSubj.value,
            state: State.PAUSED,
            pauseTime: this.now()
        });
    }

    public resumeTimer() {
        const lastState = this.valueSubj.value;
        const pause: Pause = {
            start: lastState.pauseTime,
            end: this.now()
        };

        this.valueSubj.next({
            ...this.valueSubj.value,
            state: State.STARTED,
            pauseTime: null,
            pauses: [...lastState.pauses, pause]
        });
    }


    public stopTimer() {
        const lastState = this.valueSubj.value;
        const entry: Entry = {
            start: lastState.startTime,
            end: this.now(),
            pauses: lastState.pauses
        };

        this.valueSubj.next({
            ...lastState,
            state: State.IDLE,
            startTime: null,
            pauses: [],
            history: [...lastState.history, entry]
        });
    }

    public deleteEntry(entry: Entry) {
        // identify by start and end.
        // good enough for this, but ideally it would use an ID instead.
        const lastState = this.valueSubj.value;
        this.valueSubj.next({
            ...lastState,
            history: [...lastState.history].filter(it => it.start !== entry.start && it.end !== entry.end)
        });
    }

    public addEntry(entry: Entry) {
        const lastState = this.valueSubj.value;

        // Add to history and resort by start time
        this.valueSubj.next({
            ...lastState,
            history: [...lastState.history, entry].sort((a, b) => a.start - b.start)
        });
    }

    private now(): number {
        return new Date().getTime();
    }
}


export class AppState {
    // state of the timer
    state: State;
    // if currently running/paused - time the task started
    startTime: number;
    // if currently paused - time the pause started
    pauseTime: number;
    // pauses of current timer
    pauses: Pause[];
    // previous entries
    history: Entry[];
}
