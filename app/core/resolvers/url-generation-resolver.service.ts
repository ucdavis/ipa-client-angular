import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class UrlGenerationResolver implements Resolve<any> {
  constructor(private authService: AuthService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let workgroupId = route.params.workgroupId;
    let year = route.params.year;

    return this.authService.validate(workgroupId, year).pipe(map((res: any) => {
      debugger;
      // TODO: figures out if url is ok, and if not, fix it and use router to change
    }));
  }
}
