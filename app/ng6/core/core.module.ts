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
import { SchedulingUIService } from '@scheduling/scheduling-ui.service';

import { ExceptionHandler } from '@core/exception.service';
import { SlowConnectionInterceptor } from '@core/api/slow-connection.interceptor';
import { MatIconRegistry, MatDialogModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

// Material
import {
  MatChipsModule,
  MatExpansionModule,
  MatButtonModule,
  MatTooltipModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatSelectModule,
  MatMenuModule,
  MatTabsModule
} from '@angular/material';

// Components
import { IpaHeader } from '@core/components/ipa-header/ipa-header.component';
import { IpaNav } from '@core/components/ipa-nav/ipa-nav.component';
import { ImpersonateModal } from '@core/components/impersonate-modal/impersonate-modal.component';

// TODO: Bundle up Material module imports
@NgModule({
  // Injected modules
  imports: [
    CommonModule,
    HttpClientModule,
    MatToolbarModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
    MatTabsModule,
    MatTooltipModule
  ],
  // Required for displaying components not referneced via selector
  entryComponents: [IpaHeader, ImpersonateModal],
  // Injected components and directives
  declarations: [IpaHeader, IpaNav, ImpersonateModal],
  // Exports made available to modules that import core
  // You can't export unless you've wired into yourself
  exports: [IpaNav, MatIconModule],
  // Injected services
  providers: [
    AuthService,
    ApiService,
    SharedStateService,
    SchedulingUIService,
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
