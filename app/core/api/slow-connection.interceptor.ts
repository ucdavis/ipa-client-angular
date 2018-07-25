import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class SlowConnectionInterceptor implements HttpInterceptor {
  requestCount: number = 0;

  constructor(){}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Record request went out
    this.requestCount += 1;

    // Reset warn and error timers

    // TODO: start timers for warn and error

    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        debugger;
        // do stuff with response if you want
      }
    }));
}

// var reqCount = 0;
// return {
//   request: function (config) {
//     reqCount++;
//     if ($rootScope.slowResTime) { $timeout.cancel($rootScope.slowResTime); }
//     if ($rootScope.timeOutTimer) { $timeout.cancel($rootScope.timeOutTimer); }

//     var slowResDelay = 15000; // 8 seconds
//     var timeOutDelay = 45000; // 45 seconds

//     $rootScope.slowResTime = $timeout(function () {
//       $rootScope.$emit('toast', { message: "Server appears to be slow. Please standby...", type: "WARNING" });
//     }, slowResDelay);

//     $rootScope.timeOutTimer = $timeout(function () {
//       $rootScope.$emit('toast', { message: "Server appears to have failed.", type: "ERROR", options: { timeOut: 0, closeButton: true } });
//     }, timeOutDelay);

//     return config;
//   },
//   response: function (response) {
//     if (--reqCount === 0) {
//       $timeout.cancel($rootScope.slowResTime);
//       $timeout.cancel($rootScope.timeOutTimer);
//       toastr.clear();
//     }

//     return response;
//   },
//   responseError: function (rejection) {
//     if (--reqCount === 0) {
//       $timeout.cancel($rootScope.slowResTime);
//       $timeout.cancel($rootScope.timeOutTimer);
//       toastr.clear();
//     }

//     // Redirect 'Access Denied' responses to /accessDenied
//     if (rejection.status === 403) {
//       $rootScope.loadingError = 403;
//     }

//     return $q.reject(rejection);
//   }
