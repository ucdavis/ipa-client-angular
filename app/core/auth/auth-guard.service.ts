import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate(): boolean|Observable<boolean> {
    return Observable.create(observer => {

      this.authService.validateToken().subscribe((res) => {
        if (res.token) {
          // TODO: store the termStates and userRoles in a shared localStorage thing
          debugger;
          return true;
        } else {
          debugger;
          // this.authService.redirect(cas);
          this.authService.redirectToCas();
          return false;
        }
      });

    });
  }
}