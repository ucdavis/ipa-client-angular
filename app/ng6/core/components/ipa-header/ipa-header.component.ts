import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedStateService } from '@core/shared-state/shared-state.service';
import { SchedulingUIService } from '../../../newScheduling/scheduling-ui.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ApiService } from '@core/api/api.service';
import { AuthService } from '@core/auth/auth.service';
import { ImpersonateModal } from '@core/components/impersonate-modal/impersonate-modal.component';

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
  workgroupUsers;
  isImpersonating: boolean;
  currentUser;
  activePageTitle: string;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedState: SharedStateService,
    private schedulingUIService: SchedulingUIService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.activePageTitle = location.pathname.split('/')[1].split('new')[1];

    this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
      displayName: localStorage.getItem('displayName'),
      loginId: localStorage.getItem('loginId')
    };

    // A user is impersonating when it has a realLoginId that is different than the loginId
    this.isImpersonating = this.currentUser.realUserLoginId
      ? this.currentUser.loginId !== this.currentUser.realUserLoginId
      : false;
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

    this.apiService.get(`/api/workgroupView/${this.workgroupId}`).subscribe(res => {
      this.workgroupUsers = res.users;
    });
  }

  openImpersonateModal(): void {
    const dialogRef = this.dialog.open(ImpersonateModal, {
      width: '500px',
      data: this.workgroupUsers
    });

    dialogRef.afterClosed().subscribe(userToImpersonate => {
      this.authService.impersonate(userToImpersonate.loginId);

      // TODO: currentUser localStorage operations should be done inside of sharedState service
      let currentUserObj = {
        loginId: userToImpersonate.loginId,
        displayName: userToImpersonate.displayName,
        realUserLoginId: localStorage.getItem('loginId'),
        realUserDisplayName: localStorage.getItem('displayName')
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUserObj));
    });
  }

  unimpersonate(): void {
    this.authService.unimpersonate();
    localStorage.removeItem('currentUser');
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
