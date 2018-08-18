import { Component } from '@angular/core';
import { SchedulingActions } from '../../scheduling-actions.service';

@Component({
  selector: 'schedule-summary',
  templateUrl: './schedule-summary.component.html',
  styleUrls: ['schedule-summary.component.css']
})
export class ScheduleSummaryComponent {
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
    for (let i = 0; i < this.dataSource.length; ) {
      let currentValue = accessor(this.dataSource[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.dataSource.length; j++) {
        if (currentValue != accessor(this.dataSource[j])) {
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

    this.schedulingActions.getReportState().subscribe(data => {
      this.dataSource = data;
      this.cacheSpan('title', d => d.title);
    });
  }
}
