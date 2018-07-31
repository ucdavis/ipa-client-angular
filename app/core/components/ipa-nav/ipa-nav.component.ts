import { Component } from '@angular/core';
import { INavAccordion } from '@core/components/ipa-nav/nav-accordion.model';

@Component({
  selector: 'ipa-nav',
  templateUrl: './ipa-nav.component.html',
  styleUrls: ['./ipa-nav.component.css']
})
export class IpaNav {
  isNavExpanded: boolean = false;
  activeAccordion: string;
  activePage: string;
  summary: INavAccordion;
  instructor: INavAccordion;
  taAndReader: INavAccordion;
  report: INavAccordion;

  constructor() {
    this.summary = {
      description: "Summary",
      key: "summary",
      icon: "home",
      links: [
        { description: 'Staff', key: 'staff'},
        { description: 'Support Staff', key: 'support staff'}
      ]
    };
    this.instructor = {
      description: "Instructor",
      key: "summary",
      icon: "person_add",
      links: [
        { description: 'Staff', key: 'staff'},
        { description: 'Support Staff', key: 'support staff'}
      ]
    };
    this.taAndReader = {
      description: "TAs and Readers",
      key: "summary",
      icon: "people",
      links: [
        { description: 'Staff', key: 'staff'},
        { description: 'Support Staff', key: 'support staff'}
      ]
    };

    this.report = {
      description: "Report",
      key: "summary",
      icon: "assignment",
      links: [
        { description: 'Staff', key: 'staff'},
        { description: 'Support Staff', key: 'support staff'}
      ]
    };
  }

  ngOnInit() {
  }

  toggleSideNav () {
    this.isNavExpanded = !this.isNavExpanded;
  }
}

// scope.year = $routeParams.year;
// scope.workgroupId = $routeParams.workgroupId;
// scope.termShortCode = $routeParams.termShortCode;
// scope.currentEndHref = $location.path().split('/').pop();

// // Term navigation is disabled in read only mode
// scope.readOnlyMode = false;

// // Instructor/SupportStaff forms should not allow for term navigation
// if (scope.currentEndHref == "instructorSupportCallForm"
// || scope.currentEndHref == "studentSupportCallForm") {
// 		scope.readOnlyMode = true;
// }

// scope.termDefinitions = Term.prototype.generateTable(scope.year);

// scope.getScheduleTerms = function () {
// 	return scope.termDefinitions;
// };

// scope.scheduleTerms = scope.getScheduleTerms();

// scope.scheduleTerms.forEach( function(term) {
// 	if (term.shortCode == scope.termShortCode) {
// 		scope.currentTermDescription = term.description;
// 	}
// });

// if (scope.termShortCode == null) {
// 	scope.readOnlyMode = true;
// 	scope.currentTermDescription = "Annual";
// }

// scope.gotoTerm = function (newTermShortCode) {
// 	var url = $location.absUrl();

// 	let n = url.lastIndexOf(scope.termShortCode);
// 	if (n > -1) {
// 		url = url.substring(0, n) + newTermShortCode + url.substring(n+2, url.length);
// 	}

// 	$window.location.href = url;
// };
