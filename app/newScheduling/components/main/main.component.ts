import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AppState } from '@scheduling/models/app.model';
import { SchedulingState } from '@scheduling/models/scheduling.model';
import { SchedulingActions } from '@scheduling/scheduling-actions.service';

@Component({
  selector: 'main',
  templateUrl: './main.component.html'
})
export class MainComponent {
  scheduling: Observable<SchedulingState>;
  schedulingName: String;
  schedulingShow: boolean;
  courses: Array<any>;
  sectionGroups: Array<any>;

  constructor(
    private store: Store<AppState>,
    private schedulingActions: SchedulingActions,
    private activatedRoute: ActivatedRoute) {

      this.scheduling = this.store.select('scheduling');
  }

  ngOnInit() {
    this.sectionGroups = this.activatedRoute.snapshot.data.sectionGroups;

    this.scheduling.subscribe((state) => {
      console.log(state);
      this.schedulingName = state.name;
      this.schedulingShow = state.showName;
      this.courses = state.courses.list;
    })
  }

  getCourses() {
    this.schedulingActions.getCourses();
  }

  toggleMessage() {
    this.store.dispatch({type: 'TOGGLE_MESSAGE'})
  }
}
