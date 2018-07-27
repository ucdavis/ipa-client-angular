// CSS imports for non-module
import '@project/node_modules/toastr/build/toastr.css';

import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { ApiService } from './api/api.service';
import { SharedStateService } from '@core/shared-state/shared-state.service';
import { ExceptionHandler } from './exception.service';
import { SlowConnectionInterceptor } from './api/slow-connection.interceptor';
import { MatIconRegistry } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import '@angular/material/prebuilt-themes/indigo-pink.css'; // might want to create a vendor.ts file for all third-party imports
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

// Components
import { IpaHeader } from '@core/components/ipa-header/ipa-header.component';

@NgModule({
  // Injected modules
  imports: [CommonModule,
    HttpClientModule,
    MatToolbarModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule
  ],
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
    MatIconRegistry,
    { provide: ErrorHandler, useClass: ExceptionHandler },
    // Interceptors are fired in the sequence listed here
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SlowConnectionInterceptor, multi: true }
  ]
})
export class CoreModule {}
