import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiRoot = 'http://localhost:8080';

  constructor(private http: HttpClient, private router: Router) {}

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
