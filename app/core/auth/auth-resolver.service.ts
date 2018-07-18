import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
 
import { AuthService }  from './auth.service';
 
@Injectable()
export class AuthResolver implements Resolve<any> {
  constructor(private authService: AuthService, private router: Router) {}
 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    let id = route.paramMap.get('id');

    this.router.dispose();

    //let url:any = "https://ssodev.ucdavis.edu/cas/login?service=http://localhost:8080/post-login?ref=http://localhost:9000/summary/";
    //window.location.href=url;
    console.log("redirecting");

    return null;
  }
}