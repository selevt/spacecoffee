import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PwaService {
    private promptEvent: Event;

    constructor() {
        window.addEventListener('beforeinstallprompt', event => {
            this.promptEvent = event;
        });
    }

    get canPrompt() {
        return this.promptEvent != null && (this.promptEvent as any).prompt;
    }

    public prompt() {
        (this.promptEvent as any).prompt();
    }
}
