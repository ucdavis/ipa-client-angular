import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { SharedStateService } from '@core/shared-state/shared-state.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiRoot = 'http://localhost:8080'; //TODO: FIXME: Should come from clientConfig

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedStateService: SharedStateService) {}

  // Triggers a call to login,
  // Determines when to set/purge state and redirect to cas,
  // Determines if (error handling / no access) redirection is necessary
  validate(workgroupId, year): Observable<any> {
    return this.login().pipe(map((res: any) => {
      let data = res.body;

      if (res.status == 200) {
        if (data.token) {
          data.workgroupId = workgroupId;
          data.year = year;
          this.sharedStateService.setSharedState(data);
        } else {
          this.sharedStateService.purgeSharedState();
          this.redirectToCas(data.redirectUrl);
        }
        return data;
      } else if (res.status == 403) {
        // TODO: convert angularJs logic to Angular
        // $log.error("Authentication request received a 403. Redirecting to access denied page ...");
        // localStorage.clear();
        // $window.location.href = "/access-denied.html";
      } else if (res.status == -1) {
        // TODO: convert angularJs logic to Angular
        // Request was aborted (e.g. user hit reload while it took too long) or server not found
        // $rootScope.$emit('toast', { message: "Could not authenticate due to server error. Try reloading the page.", type: "ERROR", timeOut: 60000 });
        // message = "Request was aborted or server was not found. Check that the backend is running.";
        // $log.error(message);
      } else {
        // TODO: convert angularJs logic to Angular
        // Backend exceptions generate HTTP 500, which would fall here and redirect to form.
        // If the user fills out the form, we can tie their user story to our backend
        // exception e-mails.
        // message = "Unknown error occurred while authenticating. Details:";
        // $log.error(message);
        // $log.error(error);
        // self.redirectToErrorPage(error, message, loginId, jwt);
      }

      return data;
    }));
  }

  login(): Observable<any> {
    var token = localStorage.getItem('JWT');

    return this.http
      .post(
        this.apiRoot + '/login',
        { token: token },
        { withCredentials: true, observe: 'response' }
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
