import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate(): boolean|Observable<boolean> {
      return this.authService.validateToken().pipe(map((res: any) => {
        if (res.token) {
          // TODO: store the termStates and userRoles in a shared localStorage thing
          return true;
        } else {
          this.authService.redirectToCas();
          return false;
        }
      }));
  }
}