import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { AppState } from '@scheduling/models/app.model';
import { SchedulingState } from '@scheduling/models/scheduling.model';
import { SchedulingActions } from '@scheduling/scheduling-actions.service';

import * as toastr from 'toastr';

@Component({
  selector: 'main',
	templateUrl: './main.component.html',
	styleUrls: ['main.component.css'],
})
export class MainComponent {
  tooltip: string = 'Taco';
  scheduling: Observable<SchedulingState>;
  schedulingName: String;
  schedulingShow: boolean;
  courses: Array<any>;
  sectionGroups: Array<any>;
  selectedValue: string;

  foods: any[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

	constructor(
    private schedulingActions: SchedulingActions,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.schedulingActions.sectionGroups.subscribe(sectionGroups => {
      this.sectionGroups = sectionGroups;
    });
  }

  getCourses() {
    this.schedulingActions.getCourses();
  }

  errorTest() {
    let list: any[] = [1, 2, 3];

    list[0].substr(1);
  }

  toggleMessage() {
    //this.store.dispatch({ type: 'TOGGLE_MESSAGE' });
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
