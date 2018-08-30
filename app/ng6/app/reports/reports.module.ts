import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ReportsRoutingModule } from './reports-routing.module';

import { ScheduleSummaryReportPageComponent } from './pages';

@NgModule({
  imports: [
    ReportsRoutingModule,
    SharedModule
  ],
  declarations: [
    // components
    // none
    // pages
    ScheduleSummaryReportPageComponent
  ]
})
export class ReportsModule { }
