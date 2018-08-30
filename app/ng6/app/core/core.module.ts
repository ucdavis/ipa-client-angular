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

// Material
import { AppMaterialModule } from '@shared/app-material.module';

// Components
import { IpaHeaderComponent } from '@core/components/ipa-header/ipa-header.component';
import { ImpersonateModal } from '@core/components/impersonate-modal/impersonate-modal.component';

@NgModule({
  // Injected modules
  imports: [
    AppMaterialModule,
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  // Required for displaying components not referneced via selector
  entryComponents: [ImpersonateModal],
  // Injected components and directives
  declarations: [IpaHeaderComponent, ImpersonateModal],
  // Exports made available to modules that import core
  // You can't export unless you've wired into yourself
  exports: [AppMaterialModule, IpaHeaderComponent],
  // Injected services
  providers: [
    AuthService,
    ApiService,
    SharedStateService,
    RedirectGuard,
    SharedStateResolver,
    { provide: ErrorHandler, useClass: ExceptionHandler },
    // Interceptors are fired in the sequence listed here
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SlowConnectionInterceptor, multi: true }
  ]
})
export class CoreModule {}
