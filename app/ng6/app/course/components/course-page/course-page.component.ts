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
  dataSource: any = SAMPLE_DATA;
  displayedColumns: string[] = ['selected', 'course', 'fall', 'winter', 'spring'];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.workgroupId = this.route.snapshot.data.params['workgroupId'];
    this.year = this.route.snapshot.data.params['year'];
  }

  selectedCount() {
    return this.dataSource.reduce((acc, currentVal) => {
      return acc + (currentVal.selected ? 1 : 0);
    }, 0);
  }

  toggleSelectAll() {
    const count = this.selectedCount();

    if (count > 0) {
      // deselect all
      this.dataSource = this.dataSource.map(course => {
        course.selected = false;
        return course;
      });
    } else {
      this.dataSource = this.dataSource.map(course => {
        course.selected = true;
        return course;
      });
    }
  }

  toggleSelect(index) {
    this.dataSource[index].selected = !this.dataSource[index].selected;
  }

  checkboxStatus() {
    const count = this.selectedCount();

    if (count === this.dataSource.length) {
      return 'check_box';
    } else if (count > 0) {
      return 'indeterminate_check_box';
    } else {
      return 'check_box_outline_blank';
    }
  }
}
