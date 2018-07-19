import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { ApiService } from './api/api.service';
import { AuthGuard } from '@core/auth/auth-guard.service.ts';
import { AuthResolver } from '@core/auth/auth-resolver.service.ts';

@NgModule({
  // Injected modules
  imports: [CommonModule, HttpClientModule],
  // Injected components and directives
  declarations: [],
  // Injected services
  providers: [
    AuthService,
    ApiService,
    AuthGuard,
    AuthResolver,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})

export class CoreModule {}
