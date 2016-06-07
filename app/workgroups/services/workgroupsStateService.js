'use strict';

/**
 * @ngdoc service
 * @name workgroupsApp.workgroupsStateService
 * @description
 * # workgroupsStateService
 * Service in the workgroupsApp.
 * Central location for sharedState information.
 */
workgroupsApp.service('workgroupsStateService', function ($rootScope) {
	return {
		_state: {
			tags: [
				{
					id: 1,
					name: "Undergrad"
				},
				{
					id: 2,
					name: "Graduate"
				},
				{
					id: 3,
					name: "Core Course"
				},
			]
		},
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
		workgroupsReducers: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			scope._state.tags = scope._tagReducers(action, scope._state.tags);

			$rootScope.$emit('workgroupsStateChanged',scope._state);
		},
		getState: function () {
			return this._state;
		}
	}
});