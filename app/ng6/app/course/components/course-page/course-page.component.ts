import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SAMPLE_DATA } from './course-page.model';

@Component({
  selector: 'app-course-page',
  templateUrl: './course-page.component.html',
  styleUrls: ['course-page.component.css']
})
export class CoursePageComponent implements OnInit {
  workgroupId: string;
  year: string;
  dataSource = SAMPLE_DATA;
  displayedColumns: string[] = ['selected', 'course', 'fall', 'winter', 'spring'];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.workgroupId = this.route.snapshot.data.params['workgroupId'];
    this.year = this.route.snapshot.data.params['year'];
  }
}
