import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService }  from '@core/api/api.service';
import { Course } from '@core/models/course.model';

@Injectable()
export class CourseResolver implements Resolve<Course[]> {
  constructor(private apiService: ApiService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course[]> {
    let workgroupId = route.params.workgroupId;
    let year = route.params.year;

    let url = "/api/workgroups/" + workgroupId + "/years/" + year + "/courses";
    return this.apiService.get(url)
  }
}
