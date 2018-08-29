import { AppComponent } from '@scheduling/components/app/app.component';
import { MainComponent } from '@scheduling/components/main/main.component';
import { ScheduleSummaryComponent } from '@scheduling/components/schedule-summary/schedule-summary.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { SchedulingActions } from '@scheduling/scheduling-actions.service';

// Core
import { CoreModule } from '@core/core.module';
import { AuthGuard } from '@core/auth/auth-guard.service';
import { RedirectGuard } from '@core/api/redirect-guard.service';

import { ApiService } from '@core/api/api.service';

import { ReportsService } from '@scheduling/services/reports.service';

import { UrlParameterResolver } from '@core/resolvers/param-resolver.service';

// Angular Material components
import {
  MatButtonModule,
  MatTooltipModule,
  MatSortModule,
  MatInputModule
} from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

const appRoutes: Routes = [
  {
    path: 'reports/:workgroupId/:year/:termCode',
    component: MainComponent,
    canActivate: [AuthGuard],
    resolve: {
      params: UrlParameterResolver
    }
  },
  {
    path: '**',
    component: AppComponent,
    canActivate: [RedirectGuard]
  }
];

@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserAnimationsModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatInputModule
  ],
  declarations: [AppComponent, MainComponent, ScheduleSummaryComponent],
  providers: [ApiService, SchedulingActions, AuthGuard, UrlParameterResolver, ReportsService],
  bootstrap: [AppComponent]
})
export class AppModule {}
