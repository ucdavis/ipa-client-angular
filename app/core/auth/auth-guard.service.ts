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
    return this.authService.validateToken().pipe(map((res: any) => {
      if (res.token) {
        let workgroupId = route.params.workgroupId;
        let year = route.params.year;
        res.workgroupId = workgroupId;
        res.year = year;

        this.sharedStateService.setSharedState(res);
        return true;
      } else {
        this.sharedStateService.purgeSharedState();
        this.authService.redirectToCas();
        return false;
      }
    }));
  }
}