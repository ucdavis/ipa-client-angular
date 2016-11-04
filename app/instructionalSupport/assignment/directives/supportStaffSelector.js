/**
 * Provides the main course table in the Courses View
 */
instructionalSupportApp.directive("supportStaffSelector", this.supportStaffSelector = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'A',
		template:
		'<span class="clickable" data-toggle="dropdown" aria-haspopup="true" style="width: 100%; display: block;" aria-expanded="false">'
			+ 'Assign 30%'
		+ '</span>'
		+	'<ul class="dropdown-menu">'
			+ '<li class="dropdown-header" stop-event="click">Faculty Preferences</li>'
			+ '<li role="separator" class="divider"></li>'

			+ '<li ng-repeat="tagId in view.state.tags.ids track by $index" class="clickable" ng-click="tagToggled(tagId)">'
				+ '<a class="small">'
					+ '<span class="course-filter-item">{{ view.state.tags.list[tagId].name }}</span>'
				+ '</a>'
			+ '</li>'
			+ '<li class="clickable" ng-click="tagToggled(tagId)">'
				+ '<a class="small">'
					+ '<span class="course-filter-item">Rogers, Mister</span>'
				+ '</a>'
			+ '</li>'
			+ '<li class="clickable" ng-click="tagToggled(tagId)">'
				+ '<a class="small">'
					+ '<span class="course-filter-item">Phillips, Jeremy </span>'
				+ '</a>'
			+ '</li>'
			+ '<li class="clickable" ng-click="tagToggled(tagId)">'
				+ '<a class="small">'
					+ '<span class="course-filter-item">Dole, Bob</span>'
				+ '</a>'
			+ '</li>'

		+ '</ul>',
		link: function (scope, element, attrs) {


		} // end link
	};
});
