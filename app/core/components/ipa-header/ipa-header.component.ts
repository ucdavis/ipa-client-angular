import { Component } from '@angular/core';

@Component({
  selector: 'ipa-header',
  templateUrl: './ipa-header.component.html'
})
export class IpaHeader {
  constructor() {}
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
