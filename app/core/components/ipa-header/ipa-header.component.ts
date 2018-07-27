import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'ipa-header',
  templateUrl: './ipa-header.component.html',
  styleUrls: ['./ipa-header.component.css']
})
export class IpaHeader {
  sideNavOpened: boolean = true;
   step = 0;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/examples/thumbup-icon.svg'));
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  toggleSideNav () {
    this.sideNavOpened = !this.sideNavOpened;
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
