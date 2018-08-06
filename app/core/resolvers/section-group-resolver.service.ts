import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService }  from '@core/api/api.service';
import { SectionGroup } from '@core/models/section-group.model';

@Injectable()
export class SectionGroupResolver implements Resolve<SectionGroup[]> {
  constructor(private apiService: ApiService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SectionGroup[]> {
    let workgroupId = route.params.workgroupId;
    let year = route.params.year;

    let url = "/api/workgroups/" + workgroupId + "/years/" + year + "/sectionGroups";
    return this.apiService.get(url)
  }
}
