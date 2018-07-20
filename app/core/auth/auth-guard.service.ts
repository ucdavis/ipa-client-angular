import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedStateService } from '@core/shared-state/shared-state.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private sharedStateService: SharedStateService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean|Observable<boolean> {
    let workgroupId = route.params.workgroupId;
    let year = route.params.year;

    return this.authService.validate(workgroupId, year).pipe(map((res: any) => {
      debugger;
      if (res.token) {
        return true;
      } else {
        return false;
      }
    }));
  }
}