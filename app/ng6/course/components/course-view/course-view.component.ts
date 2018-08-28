import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['course-view.component.css']
})
export class CourseViewComponent {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params;
    debugger;
  }
}
