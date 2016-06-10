'use strict';

/**
 * @ngdoc service
 * @name workgroupApp.workgroupActionCreators
 * @description
 * # workgroupActionCreators
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
workgroupApp.service('workgroupActionCreators', function (workgroupStateService, workgroupService) {
	return {
		addTag: function (workgroupCode, tag) {
			workgroupService.addTag(workgroupCode, tag).then(function (newTag) {
				var action = {
					type: ADD_TAG,
					payload: {
						tag: newTag
					}
				};
				workgroupStateService.reduce(action);
			});
		},
		getInitialState: function (workgroupCode) {
			workgroupService.getWorkgroupByCode(workgroupCode).then(function (payload) {
				var action = {
					type: INIT_WORKGROUP,
					payload: payload
				};
				workgroupStateService.reduce(action);
			});
		}
	}
});