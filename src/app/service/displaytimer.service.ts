import { Injectable } from '@angular/core';
import { Store, AppState } from './store.service';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../model/spacecoffee.model';

@Injectable({
    providedIn: 'root'
})
export class DisplayTimer {

    constructor(private store: Store) {
    }

    public display(state: AppState): DisplayTimerValues {
        return {
            pauseTime: 0,
            totalWork: this.totalWork(state),
            totalPauses: this.sumPauses(state.pauses)
        };
    }

    private totalWork(state: AppState): number {
        if (state.state === State.IDLE) {
            return 0;
        }
        const upTo = state.state === State.PAUSED ? state.pauseTime : this.now();
        return upTo - state.startTime - this.sumPauses(state.pauses);
    }

    public sumPauses(pauses: any[]) {
        return pauses
            .map(pause => pause.end - pause.start)
            .reduce((acc, cur) => acc + cur, 0);
    }

    public timer(interval: number) {
        return timer(0, interval).pipe(
            map(_ => this.store.latestValues),
            map(state => this.display(state))
        );
    }


    /**
     * Converts milliseconds into a user understandable string, e.g. 3h 20m 10s
     * 
     * @param duration in milliseconds
     */
    public durationToString(duration: number) {
        const runSec = Math.floor(duration / 1000);

        let res = '';
        if (runSec > 3600) {
            res += Math.floor(runSec / 3600) + 'h ';
        }
        if (runSec > 60) {
            res += Math.floor((runSec % 3600) / 60) + 'm ';
        }

        res += (runSec % 60) + 's';
        return res;
    }

    private now(): number {
        return new Date().getTime();
    }
}

export class DisplayTimerValues {
    public pauseTime: number;
    public totalWork: number;
    public totalPauses: number;
}
