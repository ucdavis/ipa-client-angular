import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { from } from 'rxjs';

import { SharedStateService }  from '@core/shared-state/shared-state.service';
import { SharedState } from '@core/shared-state/shared-state.model';

@Injectable()
export class SharedStateResolver implements Resolve<SharedState> {
  constructor(
    private router: Router,
    private sharedStateService: SharedStateService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SharedState> {
    let workgroupId = route.params.workgroupId;
    let year = route.params.year;
    //let results = from(this.sharedStateService.getSharedState());
    return new Observable();
  }
}
