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
  currentWorkgroup: string;
  filteredWorkgroups: string[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedState: SharedStateService
  ) {}

  ngOnInit() {
    const roles = this.sharedState.getSharedState().userRoles;

    this.year = this.route.snapshot.url[2].path;
    this.currentWorkgroup = JSON.parse(localStorage.getItem('workgroup')).name;
    this.filteredWorkgroups = Array.from(
      new Set(roles.filter(role => role.workgroupId > 0).map(role => role.workgroupName))
    ).sort();
  }

  offsetYearInUrl(offset: number) {
    const currentYear = this.year;
    const currentPath = this.router.url.split(currentYear);
    this.year = (parseInt(this.year) + offset).toString();

    const updatedPath = currentPath[0] + this.year + currentPath[1];
    this.router.navigate([updatedPath]);
  }

  yearToAcademicYear() {
    return `${this.year} - ${(parseInt(this.year) + 1).toString().slice(-2)}`;
  }
}
