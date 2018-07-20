import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService }  from '@core/auth/auth.service';

@Injectable()
export class SectionGroupResolver implements Resolve<any> {
  constructor(private authService: AuthService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    debugger;
    return null;
  }
}
