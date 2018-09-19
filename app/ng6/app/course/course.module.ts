import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '@core/core.module';

import { CourseMainComponent } from './components/course-main/course-main.component';
import { CourseViewComponent } from './components/course-view/course-view.component';

// import { AuthGuard } from '@core/auth/auth-guard.service';

const courseRoutes: Routes = [
  {
    path: 'newCourses/:workgroupId/:year/:termCode',
    component: CourseViewComponent
    // canActivate: [AuthGuard],
    // resolve: {
    // sectionGroups: SectionGroupResolver,
    // courses: CourseResolver
    // }
  },
  {
    path: '**',
    component: CourseMainComponent
    // canActivate: [RedirectGuard]
  }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    RouterModule.forRoot(courseRoutes, { enableTracing: false })
  ],
  declarations: [CourseMainComponent, CourseViewComponent],
  providers: [],
  bootstrap: [CourseMainComponent]
})
export class CourseModule {}
