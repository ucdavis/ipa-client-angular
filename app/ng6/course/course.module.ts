import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '@core/core.module';

import { MainComponent } from './components/main/main.component';
import { CourseComponent } from './components/course/course.component';

// import { AuthGuard } from '@core/auth/auth-guard.service';

const courseRoutes: Routes = [
  {
    path: 'newCourses/:workgroupId/:year/:termCode',
    component: CourseComponent
    // canActivate: [AuthGuard],
    // resolve: {
    // sectionGroups: SectionGroupResolver,
    // courses: CourseResolver
    // }
  },
  {
    path: '**',
    component: MainComponent
    // canActivate: [RedirectGuard]
  }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    RouterModule.forRoot(courseRoutes, { enableTracing: true })
  ],
  declarations: [MainComponent, CourseComponent],
  providers: [],
  bootstrap: [MainComponent]
})
export class CourseModule {}
