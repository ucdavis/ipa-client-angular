import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService } from '@core/api/api.service';
import { SectionGroup } from '@core/models/section-group.model';

@Injectable()
export class SectionGroupResolver implements Resolve<SectionGroup[]> {
  constructor(private apiService: ApiService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SectionGroup[]> {
    const workgroupId = route.params.workgroupId;
    const year = route.params.year;

    const url = '/api/workgroups/' + workgroupId + '/years/' + year + '/sectionGroups';

    return this.apiService.get(url);
  }
}
