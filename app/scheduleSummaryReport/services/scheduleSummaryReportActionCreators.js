import { sequenceNumberToPattern } from 'shared/helpers/sections';

class ScheduleSummaryReportActionCreators {
	constructor(scheduleSummaryReportStateService, scheduleSummaryReportService, $rootScope, dwService, termService , ActionTypes, Term, $route, AuthService) {
		this.scheduleSummaryReportStateService = scheduleSummaryReportStateService;
		this.scheduleSummaryReportService = scheduleSummaryReportService;
		this.$rootScope = $rootScope;
		this.dwService = dwService;
		this.termService = termService;
		this.ActionTypes = ActionTypes;

		return {
			getInitialState: function (workgroupId, year, termCode) {
				var self = this;
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;
				var termShortCode = $route.current.params.termShortCode;
				
				if (!termShortCode) {
					var termStates = AuthService.getTermStates();
					// LINTME
					var termShortCode = calculateCurrentTermShortCode(termStates); // eslint-disable-line no-undef
				}
				
				var termCode = Term.prototype.getTermByTermShortCodeAndYear(termShortCode, year).code;

				scheduleSummaryReportService.getInitialState(workgroupId, year, termCode).then(function (payload) {
					var action = {
						type: ActionTypes.INIT_STATE,
						payload: payload
					};
					scheduleSummaryReportStateService.reduce(action);
					self._getEnrollmentData(year, termCode);
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load schedule summary report initial state.", type: "ERROR" });
				});
			},
			_getEnrollmentData: function(year, termCode) {
				var SNAPSHOT_CODE = "CURRENT";
				var termCode = termService.termToTermCode(termCode, year);
				var subjectCodes = this._getScheduleSubjectCodes();

				subjectCodes.forEach(function(subjectCode) {
					dwService.getDwCensusData(subjectCode, null, termCode).then(function(censusSections) {
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
					}, function () {
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
	}
}

ScheduleSummaryReportActionCreators.$inject = ['ScheduleSummaryReportStateService', 'ScheduleSummaryReportService', '$rootScope', 'DwService', 'TermService', 'ActionTypes', 'Term', '$route', 'AuthService'];

export default ScheduleSummaryReportActionCreators;