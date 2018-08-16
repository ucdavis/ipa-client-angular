import { Component } from '@angular/core';
import { SchedulingActions } from '../../scheduling-actions.service';

export interface ScheduleSummary {
  title: string;
  section: string;
  CRN: number;
  enrollment: string;
  seats: number;
  activity: string;
  days: string;
  start: string;
  end: string;
  location: string;
}

const DATA: ScheduleSummary[] = [
  {
    title: 'ECS 010 Intro to Programming',
    section: 'A001',
    CRN: 123456,
    enrollment: 'H',
    seats: 0,
    activity: 'lecture',
    days: 'none',
    start: 'none',
    end: 'none',
    location: 'death-star'
  },
  {
    title: 'ECS 010 Intro to Programming',
    section: 'A002',
    CRN: 123457,
    enrollment: 'H',
    seats: 0,
    activity: 'lecture',
    days: 'none',
    start: 'none',
    end: 'none',
    location: 'death-star'
  },
  {
    title: 'ECS 010 Intro to Programming',
    section: 'A002',
    CRN: 123457,
    enrollment: 'H',
    seats: 0,
    activity: 'discussion',
    days: 'none',
    start: 'none',
    end: 'none',
    location: 'death-star'
  },
  {
    title: 'ECS 010 Intro to Programming',
    section: 'A003',
    CRN: 123458,
    enrollment: 'H',
    seats: 0,
    activity: 'lecture',
    days: 'none',
    start: 'none',
    end: 'none',
    location: 'death-star'
  },
  {
    title: 'ECS 015 Intro to Computers',
    section: 'A001',
    CRN: 4.0026,
    enrollment: 'He',
    seats: 0,
    activity: 'lecture',
    days: 'none',
    start: 'none',
    end: 'none',
    location: 'death-star'
  },
  {
    title: 'ECS 015 Intro to Computers',
    section: 'A002',
    CRN: 6.941,
    enrollment: 'Li',
    seats: 0,
    activity: 'lecture',
    days: 'none',
    start: 'none',
    end: 'none',
    location: 'death-star'
  },
  {
    title: 'ECS 020 Discrete Math for CS',
    section: 'A001',
    CRN: 9.0122,
    enrollment: 'Be',
    seats: 0,
    activity: 'lecture',
    days: 'none',
    start: 'none',
    end: 'none',
    location: 'death-star'
  },
  {
    title: 'ECS 020 Discrete Math for CS',
    section: 'A002',
    CRN: 10.811,
    enrollment: 'B',
    seats: 0,
    activity: 'lecture',
    days: 'none',
    start: 'none',
    end: 'none',
    location: 'death-star'
  },
  {
    title: 'ECS 020 Discrete Math for CS',
    section: 'A003',
    CRN: 12.0107,
    enrollment: 'C',
    seats: 0,
    activity: 'lecture',
    days: 'none',
    start: 'none',
    end: 'none',
    location: 'death-star'
  },
  {
    title: 'ECS 030 Programming&Prob Solving',
    section: 'A001',
    CRN: 14.0067,
    enrollment: 'N',
    seats: 0,
    activity: 'lecture',
    days: 'none',
    start: 'none',
    end: 'none',
    location: 'death-star'
  },
  {
    title: 'ECS 030 Programming&Prob Solving',
    section: 'A002',
    CRN: 15.9994,
    enrollment: 'O',
    seats: 0,
    activity: 'lecture',
    days: 'none',
    start: 'none',
    end: 'none',
    location: 'death-star'
  },
  {
    title: 'ECS 040 Software &Obj-Orient Prg',
    section: 'A001',
    CRN: 18.9984,
    enrollment: 'F',
    seats: 0,
    activity: 'lecture',
    days: 'none',
    start: 'none',
    end: 'none',
    location: 'death-star'
  },
  {
    title: 'ECS 050 Machine Dependent Prog',
    section: 'A001',
    CRN: 20.1797,
    enrollment: 'Ne',
    seats: 0,
    activity: 'lecture',
    days: 'none',
    start: 'none',
    end: 'none',
    location: 'death-star'
  }
];

@Component({
  selector: 'schedule-summary',
  templateUrl: './schedule-summary.component.html',
  styleUrls: ['schedule-summary.component.css']
})
export class ScheduleSummaryComponent {
  dataSource = DATA;
  displayedColumns: string[] = [
    'title',
    'section',
    'CRN',
    'enrollment',
    'seats',
    'activity',
    'days',
    'start',
    'end',
    'location'
  ];
  spanningColumns = ['title']; // unused?
  spans = [];

  constructor(private schedulingActions: SchedulingActions) {
    this.cacheSpan('title', d => d.title);
  }

  /**
   * Evaluated and store an evaluation of the rowspan for each row.
   * The key determines the column it affects, and the accessor determines the
   * value that should be checked for spanning.
   */
  cacheSpan(key, accessor) {
    for (let i = 0; i < DATA.length; ) {
      let currentValue = accessor(DATA[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < DATA.length; j++) {
        if (currentValue != accessor(DATA[j])) {
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
  }
}
