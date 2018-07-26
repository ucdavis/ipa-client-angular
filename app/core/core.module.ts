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
import { SlowConnectionInterceptor } from './api/slow-connection.interceptor';


// Components
import { IpaHeader } from '@core/components/ipa-header/ipa-header.component';

@NgModule({
  // Injected modules
  imports: [CommonModule, HttpClientModule],
  // Injected components and directives
	declarations: [IpaHeader],
	// Exports made available to modules that import core
	// You can't export unless you've wired into yourself
	exports: [IpaHeader],
  // Injected services
  providers: [
    AuthService,
    ApiService,
    SharedStateService,
    { provide: ErrorHandler, useClass: ExceptionHandler },
    // Interceptors are fired in the sequence listed here
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SlowConnectionInterceptor, multi: true }
  ]
})
export class CoreModule {}
