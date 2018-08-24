import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import * as toastr from 'toastr';

@Injectable()
export class SlowConnectionInterceptor implements HttpInterceptor {
  private requestCount: number = 0;
  private timeUntilWarn: number = 15000; // 15 seconds
  private timeUntilError: number = 45000; // 45 seconds
  private warnTimeout: any;
  private errorTimeout: any;

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Record request went out
    this.requestCount += 1;

    // Stop timers in case they are already running
    clearTimeout(this.warnTimeout);
    clearTimeout(this.errorTimeout);

    // Start/restart timers for warn/error
    this.warnTimeout = setTimeout(this.warn, this.timeUntilWarn);
    this.errorTimeout = setTimeout(this.error, this.timeUntilError);

    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // Record request successful
        this.requestCount -= 1;

        if (this.requestCount == 0) {
          clearTimeout(this.warnTimeout);
          clearTimeout(this.errorTimeout);
        }
      }
    }));
  }

  warn() {
    toastr.warning('Server appears to be slow. Please standby...');
  }

  error() {
    toastr.error('Server appears to have failed.');
  }
}
