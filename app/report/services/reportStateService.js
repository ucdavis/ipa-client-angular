/**
 * @ngdoc service
 * @name reportApp.reportStateService
 * @description
 * # reportStateService
 * Service in the reportApp.
 * Central location for sharedState information.
 */
reportApp.service('reportStateService', function ($rootScope, $log, Schedule) {
	return {
		_state: {},
		_scheduleReducers: function (action, schedules) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					schedules = {
						ids: []
					};
					var scheduleList = {};
					var length = action.payload.schedules ? action.payload.schedules.length : 0;
					for (var i = 0; i < length; i++) {
						var scheduleData = action.payload.schedules[i];
						// Using termCode as key since the Term does not have an id
						scheduleList[scheduleData.termCode] = new Term(scheduleData);
					}
					schedules.ids = _array_sortIdsByProperty(scheduleList, "year");
					schedules.list = scheduleList;
					return schedules;
				default:
					return schedules;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.schedules = scope._termReducers(action, scope._state.schedules);

			scope._state = newState;
			$rootScope.$emit('reportStateChanged', {
				state: scope._state,
				action: action
			});

			$log.debug("Report state updated:");
			$log.debug(scope._state, action.type);
		}
	};
});
