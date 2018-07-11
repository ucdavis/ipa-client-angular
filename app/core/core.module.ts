import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { ApiService } from './api/api.service';

@NgModule({
  // Injected modules
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  // Injected components and directives
  declarations: [],
  // Injected services
  providers: [
    AuthService,
    ApiService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})

export class CoreModule {}
