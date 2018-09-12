import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['course-detail.component.css']
})
export class CourseDetailComponent {
  @Input() displayedDetails: string;
}
