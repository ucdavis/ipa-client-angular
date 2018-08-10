import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { SharedStateService } from '@core/shared-state/shared-state.service';

@Component({
  selector: 'ipa-header',
  templateUrl: './ipa-header.component.html',
  styleUrls: ['./ipa-header.component.css']
})
export class IpaHeader implements OnInit {
  year: string;
  workgroupId: string;
  currentWorkgroup: string;
  filteredWorkgroups: string[];
  termCode: string;
  termsTable: { id: number; description: string; shortCode: string }[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedState: SharedStateService
  ) { }

  ngOnInit() {
    const roles = this.sharedState.getSharedState().userRoles;
    this.route.params.subscribe(params => {
      this.termCode = params.termCode;
    })
    this.year = this.route.snapshot.params['year'];
    this.workgroupId = this.route.snapshot.params['workgroupId'];
    this.currentWorkgroup = JSON.parse(localStorage.getItem('workgroup')).name;
    this.filteredWorkgroups = Array.from(
      new Set(roles.filter(role => role.workgroupId > 0).map(role => role.workgroupName))
    ).sort();

    this.termsTable = this.getTermTable();
  }

  offsetYearInUrl(offset: number) {
    this.year = (parseInt(this.year) + offset).toString();
    this.router.navigate(['../../', this.year, this.termCode], { relativeTo: this.route });
  }

  yearToAcademicYear() {
    return `${this.year} - ${(parseInt(this.year) + 1).toString().slice(-2)}`;
  }

  getTermDisplayName() {
    if (this.termCode.length != 2) {
      return '';
    }

    var termDescriptions = {
      '05': 'Summer Session 1',
      '06': 'Summer Special Session',
      '07': 'Summer Session 2',
      '08': 'Summer Quarter',
      '09': 'Fall Semester',
      '10': 'Fall Quarter',
      '01': 'Winter Quarter',
      '02': 'Spring Semester',
      '03': 'Spring Quarter'
    };

    return termDescriptions[this.termCode];
  }

  // TODO: Bring over generateTermTable()?
  getTermTable() {
    let termTable = [
      { id: 5, description: 'Summer Session 1', shortCode: '05' },
      { id: 6, description: 'Summer Special Session', shortCode: '06' },
      { id: 7, description: 'Summer Session 2', shortCode: '07' },
      { id: 8, description: 'Summer Quarter', shortCode: '08' },
      { id: 9, description: 'Fall Semester', shortCode: '09' },
      { id: 10, description: 'Fall Quarter', shortCode: '10' },
      { id: 1, description: 'Winter Quarter', shortCode: '01' },
      { id: 2, description: 'Spring Semester', shortCode: '02' },
      { id: 3, description: 'Spring Quarter', shortCode: '03' }
    ];

    return termTable;
  }

  goToTerm(shortCode) {
    // path goes up one level from '/newScheduling/20/2010/03' and replaces :termCode portion
    this.router.navigate(['../', shortCode], { relativeTo: this.route });
  }
}
