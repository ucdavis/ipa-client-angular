'use strict';

/**
 * @ngdoc service
 * @name workgroupsApp.workgroupsActionCreators
 * @description
 * # workgroupsActionCreators
 * Service in the workgroupsApp.
 * Central location for sharedState information.
 */
workgroupsApp.service('workgroupsActionCreators', function (workgroupsStateService) {
	return {
		addTag: function (tag) {
			var action = {
				type: ADD_TAG,
				payload: {
					tag: tag
				}
			};
			workgroupsStateService.workgroupsReducers(action);
		}
	}
});