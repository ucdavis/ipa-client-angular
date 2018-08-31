import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportsModule } from './reports/reports.module';
import { CourseModule } from './course/course.module';

const routes: Routes = [
  {
    path: 'courseApp',
    loadChildren: () => CourseModule
  },
  {
    path: 'reports',
    loadChildren: () => ReportsModule
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
  // {
  //   path: '**',
  //   redirectTo: 'reports' // ,
  //   // component: PageNotFoundComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
