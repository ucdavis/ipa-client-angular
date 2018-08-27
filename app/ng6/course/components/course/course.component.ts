import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['course.component.css']
})
export class CourseComponent {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params;
    debugger;
  }
}
