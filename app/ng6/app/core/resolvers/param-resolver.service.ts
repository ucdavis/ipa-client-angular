import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class UrlParameterResolver implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const workgroupId = route.params.workgroupId;
    const year = route.params.year;

    return {
      workgroupId: workgroupId,
      year: year
    };
  }
}
