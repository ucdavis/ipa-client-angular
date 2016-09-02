sharedApp.directive("termPreferences", this.termPreferences = function($uibModal) {
	return {
		restrict: 'A',
		templateUrl: 'termPreferences.html',
		scope: {
			preference: '=',
			scheduleId: '=',
			term: '=',
			instructorId: '=',
			hiddenCourseOfferingIds: '@',
			hiddenCourses: '@',
			disableSabbatical: '=?',
			sabbaticalDisableMessage: '@',
			readOnly: '=',
			onSelect: '&',
			onDelete: '&',
			onUpdate: '&'
		},
		link: function(scope, element, attrs) {
			scope.year = scope.$parent.year;
			scope.term = termToTermCode(scope.term, scope.year);

			scope.courses = scope.$parent.view.state.activeTeachingCall.scheduledCourses[scope.term];

			scope.status = {};
			scope.deletable = (typeof attrs.onDelete != 'undefined');
			scope.getDescription = function(preference) {
				if (typeof preference === 'undefined') return 'Add';
				else if (preference.buyout) return 'Buyout';
				else if (preference.sabbatical) return 'Sabbatical';
				else if (preference.courseRelease) return 'Course Release';
				else {
					return preference.subjectCode + ' ' + preference.courseNumber;
				}
			}

			scope.$watchGroup(['status.dropDownIsOpen','status.confirmIsOpen'], function(newVal) {
				if (newVal) element.addClass('disable-sorting');
				else element.removeClass('disable-sorting');
			});

		} // End link block
	};
});

termToTermCode = function(term, year) {
	switch(term) {
		case "01":
		case "02":
		case "03":
			year++;
			break;
		default:
			year;
	}
	var termCode = year + term;

	return termCode;
}
