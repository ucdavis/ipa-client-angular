sharedApp.directive("termPreferences", this.termPreferences = function($uibModal) {
	return {
		restrict: 'A',
		templateUrl: 'termPreferences.html',
		scope: {
			preference: '=',
			courses: '=',
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
			scope.status = {};
			scope.deletable = (typeof attrs.onDelete != 'undefined');
			scope.getDescription = function(preference) {
				if (typeof preference === 'undefined') return 'Add';
				else if (preference.isBuyout) return 'Buyout';
				else if (preference.isSabbatical) return 'Sabbatical';
				else if (preference.isCourseRelease) return 'Course Release';
				else {
					return preference.subjectCode + ' ' + preference.courseNumber;
				}
			}

			scope.$watchGroup(['status.dropDownIsOpen','status.confirmIsOpen'], function(newVal) {
				if (newVal) element.addClass('disable-sorting');
				else element.removeClass('disable-sorting');
			});
		}
	};
});
