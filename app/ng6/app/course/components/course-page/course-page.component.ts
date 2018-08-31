import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-page',
  templateUrl: './course-page.component.html',
  styleUrls: ['course-page.component.css']
})
export class CoursePageComponent implements OnInit {
  workgroupId: string;
  year: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.workgroupId = this.route.snapshot.data.params['workgroupId'];
    this.year = this.route.snapshot.data.params['year'];
  }
}
