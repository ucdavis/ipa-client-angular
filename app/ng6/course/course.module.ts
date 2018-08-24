import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from '@core/core.module';
import { CourseComponent } from './components/course.component';

const courseRoutes: Routes = [
  {
    path: '**',
    component: CourseComponent
  }
];

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule, CoreModule, RouterModule.forRoot(courseRoutes)],
  declarations: [CourseComponent],
  providers: [],
  bootstrap: [CourseComponent]
})
export class CourseModule {}
