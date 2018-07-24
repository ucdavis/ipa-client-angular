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
    private apiService: ApiService) {}

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
          this.redirectToCas(data.redirect);
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
        this.apiUrl + '/login',
        { token: token },
        { withCredentials: true, observe: 'response' }
      );
  }

  redirectToCas(casUrl:string): void {
    this.router.dispose();
    window.location.href = casUrl;
  }

  impersonate (loginId: string): void {
    let token = this.sharedStateService.getSharedState().JWT;

    this.apiService.post('/impersonate/' + loginId, { token: token }).subscribe((response) => {
      let jwt = response.token;
      this.sharedStateService.setJWT(jwt);
      let explodedUrl = window.location.href.split('/');
      let workgroupIndex = explodedUrl.indexOf("workgroups");
      let workgroupId = explodedUrl[workgroupIndex + 1];
      let year = explodedUrl[workgroupIndex + 2];

      window.location.href = "/summary/" + workgroupId + "/" + year;
    });
  }

  unimpersonate (): void {
    let token = this.sharedStateService.getSharedState().JWT;

    this.apiService.post('/unimpersonate', { token: token }).subscribe((response) => {
      let jwt = response.token;
      this.sharedStateService.setJWT(jwt);

      window.location.href = "/summary";
    });
  }
}
