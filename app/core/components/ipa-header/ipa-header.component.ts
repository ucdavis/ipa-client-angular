import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { SharedStateService } from '@core/shared-state/shared-state.service';
import { SchedulingUIService } from '../../../newScheduling/scheduling-ui.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'ipa-header',
  templateUrl: './ipa-header.component.html',
  styleUrls: ['./ipa-header.component.css']
})
export class IpaHeader implements OnInit {
  uiState$: Observable<any>;
  year: string;
  workgroupId: string;
  currentWorkgroup: { workgroupId: number; roleName: string; workgroupName: string };
  filteredWorkgroups: { workgroupId: number; roleName: string; workgroupName: string }[];
  termCode: string;
  termsTable: { id: number; description: string; shortCode: string }[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedState: SharedStateService,
    private schedulingUIService: SchedulingUIService
  ) {}

  ngOnInit() {
    this.filteredWorkgroups = this.getSortedWorkgroups();
    this.termsTable = this.getTermTable();

    this.route.params.subscribe(params => {
      this.termCode = params.termCode;
      this.workgroupId = params.workgroupId;
      this.year = params.year;
      this.currentWorkgroup = this.filteredWorkgroups.find(
        workgroup => workgroup.workgroupId === +this.workgroupId
      );
    });

    this.uiState$ = this.schedulingUIService.getState();
  }

  setState(key, payload) {
    this.schedulingUIService.setState(key, payload);
  }

  offsetYearInUrl(offset: number) {
    this.year = (parseInt(this.year) + offset).toString();
    this.router.navigate(['../../', this.year, this.termCode], { relativeTo: this.route });
  }

  yearToAcademicYear() {
    return `${this.year} - ${(parseInt(this.year) + 1).toString().slice(-2)}`;
  }

  getWorkgroups() {
    const roles = this.sharedState.getSharedState().userRoles;

    return roles
      .filter(role => role.workgroupId > 0)
      .filter(
        (role, index, arr) => arr.findIndex(r => r.workgroupId === role.workgroupId) === index
      );
  }

  getSortedWorkgroups() {
    const sortedWorkgroups = [...this.getWorkgroups()];

    return sortedWorkgroups.sort((a, b) => {
      if (a.workgroupName < b.workgroupName) {
        return -1;
      }
      if (a.workgroupName > b.workgroupName) {
        return 1;
      }
      return 0;
    });
  }

  changeWorkgroup(workgroupId) {
    this.router.navigate(['../../../', workgroupId, this.year, this.termCode], {
      relativeTo: this.route
    });
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
