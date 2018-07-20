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

  validate(workgroupId, year): Observable<any> {
    return this.validateToken().pipe(map((res: any) => {
      if (res.token) {
        res.workgroupId = workgroupId;
        res.year = year;
        this.sharedStateService.setSharedState(res);
      } else {
        this.sharedStateService.purgeSharedState();
        this.redirectToCas();
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

  redirectToCas(): void {
    this.router.dispose();
    let casUrl:String = "https://ssodev.ucdavis.edu/cas/login";
    let currentFrontEndUrl:String = window.location.href;
    let backendUrl:String = "http://localhost:8080/";
    let url:any = casUrl + "?service=" + backendUrl + "/post-login?ref=" + currentFrontEndUrl;
    window.location.href = url;
  }
}
