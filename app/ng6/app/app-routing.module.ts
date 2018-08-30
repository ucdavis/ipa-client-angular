import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportsModule } from './reports/reports.module';

const routes: Routes = [
  {
    path: 'reports',
    loadChildren: () => ReportsModule
  },
  {
    path: '',
    redirectTo: 'reports',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'reports' // ,
    // component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
