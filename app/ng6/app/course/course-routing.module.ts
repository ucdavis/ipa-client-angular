import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@core/auth/auth-guard.service';
import { UrlParameterResolver } from '@core/resolvers/param-resolver.service';

import { CoursePageComponent } from './components/course-page/course-page.component';

const routes: Routes = [
  {
    path: ':workgroupId/:year/:termCode',
    component: CoursePageComponent,
    canActivate: [AuthGuard],
    resolve: {
      params: UrlParameterResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule {}
