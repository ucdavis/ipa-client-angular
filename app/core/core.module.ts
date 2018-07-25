// CSS imports for non-module
import '@project/node_modules/toastr/build/toastr.css';

import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { ApiService } from './api/api.service';
import { SharedStateService } from '@core/shared-state/shared-state.service';
import { ExceptionHandler } from './exception.service';

@NgModule({
  // Injected modules
  imports: [CommonModule, HttpClientModule],
  // Injected components and directives
  declarations: [],
  // Injected services
  providers: [
    AuthService,
    ApiService,
    SharedStateService,
    { provide: ErrorHandler, useClass: ExceptionHandler },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class CoreModule {}
