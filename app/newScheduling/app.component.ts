import { Component } from '@angular/core';
import { AuthService } from '@app/core';
import { ApiService } from '@app/core';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-main',
  templateUrl: './app.component.html'
})
export class AppComponent {
  name: String = 'Taco taco taco';
  url: String = "/api/workgroups/" + 20 + "/years/" + 2018 + "/courses";
  scheduling: Observable<any>;
  schedulingName: String;
  schedulingShow: boolean;

  constructor(
    private store: Store<any>,
    private authService: AuthService,
    private apiService: ApiService,
  ) {
    // this.store.pipe(select('scheduling')).subscribe(
    //   scheduling => {
    //     this.schedulingName = scheduling.name
    //   }
    // );
    this.scheduling = this.store.select('scheduling');
  }

  ngOnInit() {
    this.scheduling.subscribe((state) => {
      console.log(state);
      this.schedulingName = state.name;
      this.schedulingShow = state.showName;
    })
  }

  validateToken() {
    //const jwt = localStorage.getItem('JWT');
    // this.authService.validateToken(jwt);

    this.apiService.get(this.url).subscribe((data: any) => console.log(data));
  }

  toggleMessage() {
    this.store.dispatch({type: 'TOGGLE_MESSAGE'})
  }
}
