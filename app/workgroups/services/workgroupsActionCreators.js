'use strict';

/**
 * @ngdoc service
 * @name sharedApp.sharedStateService
 * @description
 * # sharedStateService
 * Service in the sharedApp.
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