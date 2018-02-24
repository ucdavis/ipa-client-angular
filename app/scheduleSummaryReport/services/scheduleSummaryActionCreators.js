/**
 * @ngdoc service
 * @name scheduleSummaryReportApp.scheduleSummaryReportActionCreators
 * @description
 * # scheduleSummaryReportActionCreators
 * Service in the scheduleSummaryReportApp.
 */
scheduleSummaryReportApp.service('scheduleSummaryReportActionCreators', function (scheduleSummaryReportStateService, scheduleSummaryReportService, $rootScope, dwService, termService) {
	return {
		getInitialState: function (workgroupId, year, termCode) {
			var self = this;

			scheduleSummaryReportService.getInitialState(workgroupId, year, termCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload
				};
				scheduleSummaryReportStateService.reduce(action);
				self._getEnrollmentData(year, termCode);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load schedule summary report initial state.", type: "ERROR" });
			});
		},
		_getEnrollmentData: function(year, termCode) {
			var SNAPSHOT_CODE = "CURRENT";
			var termCode = termService.termToTermCode(termCode, year);
			var subjectCodes = this._getScheduleSubjectCodes();

			subjectCodes.forEach(function(subjectCode) {
				dwService.getDwCensusData(subjectCode, null, termCode).then(function(sections) {
					var filteredSections = [];

					sections.forEach(function(section) {
						if (section.snapshotCode == SNAPSHOT_CODE) {
							filteredSections.push(section);
						}
					});

					scheduleSummaryReportStateService.reduce({
						type: GET_CENSUS_DATA,
						payload: {
							sections: filteredSections
						}
					});
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not retrieve enrollment data.", type: "ERROR" });
				});
			});
		},
		_getScheduleSubjectCodes: function() {
			var subjectCodes = [];

			var sectionGroups = scheduleSummaryReportStateService._state.sectionGroups;

			sectionGroups.ids.forEach(function(sectionGroupId) {
				var subjectCode = sectionGroups.list[sectionGroupId].subjectCode;
				if (subjectCodes.indexOf(subjectCode) == -1) {
					subjectCodes.push(subjectCode);
				}
			});

			return subjectCodes;
		}
	};
});
