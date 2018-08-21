import { Component, ViewChild } from '@angular/core';
import { SchedulingActions } from '../../scheduling-actions.service';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'schedule-summary',
  templateUrl: './schedule-summary.component.html',
  styleUrls: ['schedule-summary.component.css']
})
export class ScheduleSummaryComponent {
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource;
  displayedColumns: string[] = [
    'title',
    'section',
    'CRN',
    'enrollment',
    'seats',
    'activities',
    'days',
    'start',
    'end',
    'location'
  ];
  spanningColumns = ['title']; // unused?
  spans = [];

  constructor(private schedulingActions: SchedulingActions) {}

  /**
   * Evaluated and store an evaluation of the rowspan for each row.
   * The key determines the column it affects, and the accessor determines the
   * value that should be checked for spanning.
   */
  cacheSpan(key, accessor) {
    this.spans = [];

    for (let i = 0; i < this.dataSource.data.length; ) {
      let currentValue = accessor(this.dataSource.data[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.dataSource.data.length; j++) {
        if (currentValue != accessor(this.dataSource.data[j])) {
          break;
        }

        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }
  }

  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }

  ngOnInit() {
    // this.schedulingActions.sectionGroups.subscribe(sectionGroups => {
    //   this.dataSource = sectionGroups;
    // });

    this.schedulingActions.reportState$.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;

      this.cacheSpan('title', d => d.title);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
