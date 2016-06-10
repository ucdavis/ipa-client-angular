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
		getInitialState: function (workgroupCode) {
			workgroupService.getWorkgroupByCode(workgroupCode).then(function (payload) {
				var action = {
					type: INIT_WORKGROUP,
					payload: payload
				};
				workgroupStateService.reduce(action);
			});
		},
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
		updateTag: function (workgroupCode, tag) {
			workgroupService.updateTag(workgroupCode, tag).then(function (newTag) {
				var action = {
					type: UPDATE_TAG,
					payload: {
						tag: newTag
					}
				};
				workgroupStateService.reduce(action);
			});
		},
		removeTag: function (workgroupCode, tag) {
			workgroupService.removeTag(workgroupCode, tag).then(function (newTag) {
				var action = {
					type: REMOVE_TAG,
					payload: {
						tag: tag
					}
				};
				workgroupStateService.reduce(action);
			});
		},
	}
});