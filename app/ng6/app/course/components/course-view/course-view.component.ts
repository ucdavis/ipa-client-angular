import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['course-view.component.css']
})
export class CourseViewComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // this.route.params;
  }
}
