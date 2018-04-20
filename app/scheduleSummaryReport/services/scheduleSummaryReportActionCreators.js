class ScheduleSummaryReportActionCreators {
	constructor(scheduleSummaryReportStateService, scheduleSummaryReportService, $rootScope, dwService, termService) {
		this.scheduleSummaryReportStateService = scheduleSummaryReportStateService;
		this.scheduleSummaryReportService = scheduleSummaryReportService;
		this.$rootScope = $rootScope;
		this.dwService = dwService;
		this.termService = termService;

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
					dwService.getDwCensusData(subjectCode, null, termCode).then(function(censusSections) {
						var filteredSections = [];

						censusSections.forEach(function(censusSection) {
							if (censusSection.snapshotCode == SNAPSHOT_CODE) {
								var censusSectionGroupKey = censusSection.subjectCode + censusSection.courseNumber + sequenceNumberToPattern(censusSection.sequenceNumber);

								scheduleSummaryReportStateService._state.sectionGroups.ids.forEach(function(sectionGroupId) {
									var sectionGroup = scheduleSummaryReportStateService._state.sectionGroups.list[sectionGroupId];
									var sectionGroupUniqueKey = sectionGroup.subjectCode + sectionGroup.courseNumber + sectionGroup.sequencePattern;

									if (sectionGroupUniqueKey == censusSectionGroupKey) {
										sectionGroup.sections.forEach(function(section) {
											if (section.sequenceNumber == censusSection.sequenceNumber) {
												section.enrollment = censusSection.currentEnrolledCount;
											}
										});
									}
								});
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
	};
}

ScheduleSummaryReportActionCreators.$inject = ['ScheduleSummaryReportStateService', 'ScheduleSummaryReportService', '$rootScope', 'dwService', 'termService'];

export default ScheduleSummaryReportActionCreators;