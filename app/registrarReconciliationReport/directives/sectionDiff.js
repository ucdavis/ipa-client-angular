/**
 * example:
 * <tr section-diff></tr>
 */
registrarReconciliationReportApp.directive("sectionDiff", this.sectionDiff = function (reportActionCreators) {
	return {
		restrict: "A",
		templateUrl: 'sectionDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.section = scope.view.state.sections.list[scope.sectionId];

			scope.toggleBannerToDoItem = function (property, childUniqueKey, childProperty) {
				// The action is to remove a section, not create
				if (scope.section.id == 0 && scope.section.noLocal == true) {
					property = "deleteSection-" + scope.section.uniqueKey;
				}

				reportActionCreators.createBannerToDoItem(scope.section.id, property, childUniqueKey, childProperty, scope.section.uniqueKey, scope.section.sectionGroupId);
			};

			scope.createSection = function (section) {
				reportActionCreators.createSection(section);
			};

			scope.setActiveChangeAction = function (event, object, index, property) {
				property = property || '';
				var actionKey = object.uniqueKey + index + property;

				if (scope.view.activeChangeAction == actionKey) {
					scope.view.activeChangeAction = '';
				} else {
					scope.view.activeChangeAction = actionKey;
				}

				// Prevent click event from going up to parent divs like activity or section if it has changes
				if (hasChanges(object, property)) {
					event.stopPropagation();
				}
			};

			scope.deleteSection = function (section) {
				reportActionCreators.deleteSection(section);
			};

			function hasChanges(object, property) {
				if (property) {
					// Property of an object, hence look at the dwChanges object
					return object.dwChanges && object.dwChanges[property] && !object.dwChanges[property].isToDo;
				} else {
					// An entire object (section, activity, instructor), look for noLocal or noRemote
					return (object.noLocal || object.noRemote) && !object.isToDo;
				}
			}
		}
	};
});
