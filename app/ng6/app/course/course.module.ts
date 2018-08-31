import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { CourseRoutingModule } from './course-routing.module';

import { CoursePageComponent } from './components/course-page/course-page.component';

@NgModule({
  imports: [CourseRoutingModule, SharedModule],
  declarations: [CoursePageComponent]
})
export class CourseModule {}
