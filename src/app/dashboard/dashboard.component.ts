import { Component, OnInit } from '@angular/core';
import { State } from '../model/spacecoffee.model';
import * as moment from 'moment';
import { Store, AppState } from '../service/store.service';
import { PwaService } from '../service/pwa.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private store: Store,
              public pwa: PwaService) {
    store.value.subscribe(appState => this.appState = appState);
  }

  public appState: AppState;

  get state() {
    return this.appState.state;
  }

  get startTime(): number {
    return this.appState.startTime;
  }

  get pauseTime(): number {
    return this.appState.pauseTime;
  }

  get navigator(): any {
    return navigator;
  }

  // model bindings
  public importValue: string;
  public exportValue: string;

  // make available in template
  public State = State;

  ngOnInit() {
  }

  public start() {
    this.store.startTimer();
  }

  public stop() {
    if (this.state === State.PAUSED) {
      this.resume();
    }
    this.store.stopTimer();
  }

  public resume() {
    this.store.resumeTimer();
  }
  public pause() {
    this.store.pauseTimer();
  }

  public importHistory() {
    this.store.importState(this.importValue);
  }
  public exportHistory() {
    this.exportValue = JSON.stringify(this.appState.history);
  }

  public addToHomeScreen() {
    this.pwa.prompt();
  }
}
