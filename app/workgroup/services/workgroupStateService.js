'use strict';

/**
 * @ngdoc service
 * @name workgroupApp.workgroupStateService
 * @description
 * # workgroupStateService
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
workgroupApp.service('workgroupStateService', function ($rootScope) {
	return {
		_state: {},
		_tagReducers: function (action, tags) {
			var scope = this;

			switch(action.type) {
				case ADD_TAG:
					tags.push(action.payload.tag);
					return tags;
				case REMOVE_TAG:
					var tagIndex = _array_getIndexById(tags, action.payload.tag.id);
					tags.splice(tagIndex, 1);
					return tags;
				case UPDATE_TAG:
					var tagIndex = _array_getIndexById(tags, action.payload.tag.id);
					tags[tagIndex] = action.payload.tag;
					return tags;
				default:
					return tags;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			if (action.type == INIT_WORKGROUP) {
				scope._state = action.payload;
			}

			scope._state.tags = scope._tagReducers(action, scope._state.tags);

			$rootScope.$emit('workgroupStateChanged',scope._state);
		}
	}
});