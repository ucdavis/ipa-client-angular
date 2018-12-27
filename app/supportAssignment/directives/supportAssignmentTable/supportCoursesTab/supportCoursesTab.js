import { isNumber } from 'shared/helpers/types';

import './supportCoursesTab.css';

let supportCoursesTab = function ($rootScope, SupportActions) {
	return {
		restrict: 'E',
		template: require('./supportCoursesTab.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope) {
			scope.radioNames = ["Teaching Assistants", "Readers"];

			scope.setViewType = function(type) {
				SupportActions.setViewType(type);
			};

			scope.isNumber = function(number) {
				return isNumber(number);
			};
		}
	};
};

export default supportCoursesTab;
