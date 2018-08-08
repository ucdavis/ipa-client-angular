import { Component } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { SharedStateService } from '@core/shared-state/shared-state.service';

@Component({
  selector: 'ipa-header',
  templateUrl: './ipa-header.component.html',
  styleUrls: ['./ipa-header.component.css']
})
export class IpaHeader {
  year: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedState: SharedStateService
  ) {}

  ngOnInit() {
    this.year = this.route.snapshot.url[2].path;
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
