import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Store, AppState } from 'src/app/service/store.service';
import { Entry, Pause } from 'src/app/model/spacecoffee.model';
import { DisplayTimer } from 'src/app/service/displaytimer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard-history',
  templateUrl: './dashboard-history.component.html',
  styleUrls: ['./dashboard-history.component.scss']
})
export class DashboardHistoryComponent implements OnInit {

  constructor(private store: Store,
              private displayTimer: DisplayTimer,
              private snackBar: MatSnackBar) { }

  private state: AppState;

  ngOnInit() {
    this.store.value.subscribe(state => this.state = state);
  }

  // TODO: pipe
  public displayWork(entry: Entry) {
    const pause = this.displayTimer.sumPauses(entry.pauses);
    const dur = entry.end - entry.start - pause;

    return this.displayTimer.durationToString(dur);
  }
  public displayPause(entry: Entry) {
    const pause = this.displayTimer.sumPauses(entry.pauses);
    return this.displayTimer.durationToString(pause);
  }

  public dateToDisplay(date: number): string {
    return moment(date).format('L LT');
  }

  get history() {
    return this.state.history;
  }

  public delete(event: Event, entry: Entry) {
    (event.target as HTMLElement).closest('.entry').classList.toggle('removed');
    // delay deletion so animation can show
    setTimeout(() => {
      this.store.deleteEntry(entry);
      const snack = this.snackBar.open('Entry deleted', 'Undo');
      snack.onAction().subscribe(() => {
        this.store.addEntry(entry);
      });
    }, 500);
  }

}
