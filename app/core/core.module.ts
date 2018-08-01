import './custom-theme.scss';

// CSS imports for non-module
import '@project/node_modules/toastr/build/toastr.css';

import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AuthInterceptor } from '@core/auth/auth.interceptor';
import { AuthService } from '@core/auth/auth.service';
import { ApiService } from '@core/api/api.service';
import { RedirectGuard } from '@core/api/redirect-guard.service';
import { SharedStateResolver } from '@core/shared-state/shared-state.resolver';
import { SharedStateService } from '@core/shared-state/shared-state.service';

import { ExceptionHandler } from '@core/exception.service';
import { SlowConnectionInterceptor } from '@core/api/slow-connection.interceptor';
import { MatIconRegistry } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

// Material

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';

// Components
import { IpaHeader } from '@core/components/ipa-header/ipa-header.component';
import { IpaNav } from '@core/components/ipa-nav/ipa-nav.component';

@NgModule({
  // Injected modules
  imports: [
    CommonModule,
    HttpClientModule,
    MatToolbarModule,
    FormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule
  ],
  // Injected components and directives
  declarations: [IpaHeader, IpaNav],
  // Exports made available to modules that import core
  // You can't export unless you've wired into yourself
  exports: [IpaNav],
  // Injected services
  providers: [
    AuthService,
    ApiService,
    SharedStateService,
    MatIconRegistry,
    RedirectGuard,
    SharedStateResolver,
    { provide: ErrorHandler, useClass: ExceptionHandler },
    // Interceptors are fired in the sequence listed here
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SlowConnectionInterceptor, multi: true }
  ]
})
export class CoreModule {}
