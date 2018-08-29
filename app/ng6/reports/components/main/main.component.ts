import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { AppState } from '@scheduling/models/app.model';
import { SchedulingState } from '@scheduling/models/scheduling.model';
import { SchedulingActions } from '@scheduling/scheduling-actions.service';
import { SchedulingUIService } from '@scheduling//scheduling-ui.service.ts';

import * as toastr from 'toastr';
import { SectionGroup } from '@core/models/section-group.model';
import { Course } from '@core/models/course.model';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['main.component.css']
})
export class MainComponent {
  tooltip = 'Taco';
  scheduling: Observable<SchedulingState>;
  schedulingName: string;
  schedulingShow: boolean;
  courses: Array<any>;
  sectionGroups: Array<SectionGroup>;
  selectedValue: string;
  activeTab: string;

  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];

  constructor(
    private schedulingActions: SchedulingActions,
    private schedulingUIService: SchedulingUIService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.schedulingActions.initializeData();

    this.schedulingActions.sectionGroups.subscribe(sectionGroups => {
      this.sectionGroups = sectionGroups;
    });

    this.schedulingUIService.getState().subscribe(state => {
      this.activeTab = state.activeTab;
    });
  }

  errorTest() {
    let list: any[] = [1, 2, 3];

    list[0].substr(1);
  }

  addCourse() {
    let course: Course = {
      subjectCode: 'ABC',
      courseNumber: '123',
      title: 'Example course',
      unitsHigh: 4,
      unitsLow: 4,
      effectiveTermCode: '201003',
      sequencePattern: 'A'
    };

    this.schedulingActions.addCourse(course);
  }

  toggleMessage() {
    // this.store.dispatch({ type: 'TOGGLE_MESSAGE' });
  }

  impersonateJarold() {
    this.schedulingActions.impersonateJarold();
  }

  unimpersonateJarold() {
    this.schedulingActions.unimpersonateJarold();
  }

  makeToast() {
    toastr.warning('My name is Jarold. You killed my father, prepare to die!');
  }
}
