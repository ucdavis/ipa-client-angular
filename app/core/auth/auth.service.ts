import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { SharedStateService } from '@core/shared-state/shared-state.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiRoot = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedStateService: SharedStateService) {}

    // Triggers a call to login, and then determines when to set/purge state and redirect to cas
  validate(workgroupId, year): Observable<any> {
    return this.validateToken().pipe(map((res: any) => {
      if (res.token) {
        res.workgroupId = workgroupId;
        res.year = year;
        this.sharedStateService.setSharedState(res);
      } else {
        debugger;
        this.sharedStateService.purgeSharedState();
        this.redirectToCas(res.redirectUrl);
      }

      return res;
    }));
  }
  validateToken(): Observable<any> {
    var token = localStorage.getItem('JWT');

    return this.http
      .post(
        this.apiRoot + '/login',
        { token: token },
        { withCredentials: true }
      );
  }

  redirectToCas(casUrl:String): void {
    this.router.dispose();
    let currentFrontEndUrl:String = window.location.href;

    // TODO: FIXME: Should pull backendUrl from clientConfig
    let backendUrl:String = "http://localhost:8080/";

    let url:any = casUrl + "?service=" + backendUrl + "/post-login?ref=" + currentFrontEndUrl;
    window.location.href = url;
  }
}
