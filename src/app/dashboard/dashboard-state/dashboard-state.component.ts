import { Component, OnInit, Input } from '@angular/core';
import { State } from 'src/app/model/spacecoffee.model';
import { Store, AppState } from 'src/app/service/store.service';
import { Observable } from 'rxjs';
import { DisplayTimer, DisplayTimerValues } from 'src/app/service/displaytimer.service';

@Component({
  selector: 'app-dashboard-state',
  templateUrl: './dashboard-state.component.html',
  styleUrls: ['./dashboard-state.component.scss']
})
export class DashboardStateComponent implements OnInit {

  public appState: AppState;

  public display: DisplayTimerValues;

  constructor(private store: Store, private displayTimer: DisplayTimer) {
    store.value.subscribe(appState => this.appState = appState);
    displayTimer.timer(1000).subscribe(values => {
      this.display = values;
    });
  }

  private detailTrigger: number;

  // @Input()
  // public state: State;

  // make available in template
  public State = State;


  ngOnInit() {
  }


  // computed
  get currentPauseDisplay() {
    if (!this.appState) {
      return '';
    }
    return this.displayTimer.durationToString(new Date().getTime() - this.appState.pauseTime);
  }

  get totalWorkDisplay() {
    if (!this.display) {
      return '';
    }
    return this.displayTimer.durationToString(this.display.totalWork);
  }

  get totalPausesDisplay() {
    if (!this.display) {
      return '';
    }
    return this.displayTimer.durationToString(this.display.totalPauses);
  }
}
