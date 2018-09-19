import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { SharedStateService } from '@core/shared-state/shared-state.service';
import { map } from 'rxjs/operators';
import { ApiService } from '@core/api/api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // 'apiUrl' value is injected via webpack
  private apiUrl: string = process.env.API_URL;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedStateService: SharedStateService,
    private apiService: ApiService
  ) {}

  // Triggers a call to login
  // Determines when to set/purge state and redirect to CAS
  // Determines if (error handling / no access) redirection is necessary
  validate(workgroupId: number, year: number): Observable<any> {
    console.debug(`AuthService.validate(): workgroupId: ${workgroupId}, year: ${year}`);

    // displayName
    // loginId
    // realUserDisplayName
    // realUserLoginId
    // redirect
    // "https://ssodev.ucdavis.edu/cas/login?service=http://localhost:8080/post-login"
    // termStates
    // (187) [{…}, {…}, {…}, {…}, {…}, {…}]
    // token
    // userRoles
    // (20) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
    // workgroupId
    // "20"
    // year
    // "2018"

    return this.http.post(
      this.apiUrl + '/login',
      { token: localStorage.getItem('JWT') },
      { withCredentials: true, observe: 'response' }
    ).pipe(
      map((res: any) => {
        const data = res.body;

        if (res.status === 200) {
          if (data.token) {
            data.workgroupId = workgroupId;
            data.year = year;
            this.sharedStateService.setSharedState(data);
          } else {
            this.sharedStateService.purgeSharedState();
            this.redirectToCas(data.redirect);
          }
          return data;
        } else if (res.status === 403) {
          // TODO: convert angularJs logic to Angular
          // $log.error("Authentication request received a 403. Redirecting to access denied page ...");
          // localStorage.clear();
          // $window.location.href = "/access-denied.html";
        } else if (res.status === -1) {
          // TODO: convert angularJs logic to Angular
          // Request was aborted (e.g. user hit reload while it took too long) or server not found
          // $rootScope.$emit('toast', {
          //                             message: "Could not authenticate due to server error. Try reloading the page.",
          //                             type: "ERROR",
          //                             timeOut: 60000
          //                           });
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
      })
    );
  }

  redirectToCas(casUrl: string): void {
    this.router.dispose();
    window.location.href = casUrl;
  }

  impersonate(loginId: string): void {
    const token = this.sharedStateService.getSharedState().JWT;

    this.apiService.post('/impersonate/' + loginId, { token: token }).subscribe(response => {
      const jwt = response.token;
      this.sharedStateService.setJWT(jwt);
      const explodedUrl = window.location.href.split('/');
      const workgroupIndex = explodedUrl.indexOf('workgroups');
      const workgroupId = explodedUrl[workgroupIndex + 1];
      const year = explodedUrl[workgroupIndex + 2];

      // window.location.href = "/summary/" + workgroupId + "/" + year;
      window.location.href = this.router.url; // TODO: redirect to summary module
    });
  }

  unimpersonate(): void {
    const token = this.sharedStateService.getSharedState().JWT;

    this.apiService.post('/unimpersonate', { token: token }).subscribe(response => {
      const jwt = response.token;
      this.sharedStateService.setJWT(jwt);

      // window.location.href = '/summary';
      window.location.href = this.router.url; // TODO: redirect to summary module
    });
  }
}
