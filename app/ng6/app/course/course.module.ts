import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { CourseRoutingModule } from './course-routing.module';

import { CoursePageComponent } from './components/course-page/course-page.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';

@NgModule({
  imports: [CourseRoutingModule, SharedModule],
  declarations: [CoursePageComponent, CourseDetailComponent]
})
export class CourseModule {}
