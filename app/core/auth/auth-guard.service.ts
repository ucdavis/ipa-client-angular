import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate() {
    return true;
    // return Observable.create(observer => {
    //   this.authService.validateToken().subscribe((res) => {
    //     console.log("taco");
    //     return false;
    //   });
    // });
  }
}