/**
 * @ngdoc service
 * @name registrarReconciliationReportApp.reportStateService
 * @description
 * # reportStateService
 * Service in the reportApp.
 * Central location for sharedState information.
 */
scheduleSummaryReportApp.service('scheduleSummaryReportStateService', function ($rootScope, $log, Term, SectionGroup) {
	return {
		_state: {},
		_sectionGroupReducers: function (action, sectionGroups) {
			var section;
			switch (action.type) {
				case INIT_STATE:

					// Build courses metadata for searching
					courses = {
						ids: [],
						list: {}
					};

					action.payload.courses.forEach( function(slotCourse) {
						courses.ids.push(slotCourse.id);
						courses.list[slotCourse.id] = slotCourse;
					});



					// Build sectionGroups metadata
					sectionGroups = {
						ids: [],
						list: {}
					};

					action.payload.sectionGroups.forEach( function(slotSectionGroup) {
						// Get course data
						var courseId = slotSectionGroup.courseId;
						var slotCourse = courses.list[courseId];

						slotSectionGroup.subjectCode = slotCourse.subjectCode;
						slotSectionGroup.courseNumber = slotCourse.courseNumber;
						slotSectionGroup.title = slotCourse.title;
						slotSectionGroup.sequencePattern = slotCourse.sequencePattern;

						// Set units value
						if (slotCourse.unitsLow && slotCourse.unitsLow > 0) {
							slotSectionGroup.units = slotCourse.unitsLow;
						} else if (slotCourse.unitsHigh && slotCourse.unitsHigh > 0) {
							slotSectionGroup.units = slotCourse.unitsHigh;
						} else {
							slotSectionGroup.units = 0;
						}

						sectionGroups.ids.push(slotSectionGroup.id);
						sectionGroups.list[slotSectionGroup.id] = slotSectionGroup;
					});

					sectionGroups.ids = _array_sortIdsByProperty(sectionGroups.list, ["courseNumber"]);

					// Build instructors metadata for searching
					instructors = {
						ids: [],
						list: {}
					};

					action.payload.instructors.forEach( function(slotInstructor) {
						instructors.ids.push(slotInstructor.id);
						instructors.list[slotInstructor.id] = slotInstructor;
					});



					// Build teachingAssignment metadata for searching
					teachingAssignments = {
						ids: [],
						list: {}
					};

					// Add instructorIds to relevant sectionGroups
					action.payload.teachingAssignments.forEach( function(slotTeachingAssignment) {
						if (slotTeachingAssignment.sectionGroupId) {

							teachingAssignments.ids.push(slotTeachingAssignment.id);
							teachingAssignments.list[slotTeachingAssignment.id] = slotTeachingAssignment;
							var slotSectionGroup = sectionGroups.list[slotTeachingAssignment.sectionGroupId];

							if (slotSectionGroup) {
								var slotInstructor = instructors.list[slotTeachingAssignment.instructorId];

								if (slotSectionGroup.instructors == null) {
									slotSectionGroup.instructors = [];
								}

								if (slotTeachingAssignment.approved) {
									slotSectionGroup.instructors.push(slotInstructor);
								}
							}
						}
					});


					// Build sections metadata for searching
					sections = {
						ids: [],
						list: {}
					};

					action.payload.sections.forEach( function(slotSection) {
						sections.ids.push(slotSection.id);
						sections.list[slotSection.id] = slotSection;
					});

					// Build activities metadata for searching and add metadata to sections
					activities = {
						ids: [],
						list: {}
					};

					action.payload.activities.forEach( function(slotActivity) {
						slotSection = sections.list[slotActivity.sectionId];

						if (slotSection) {
							if (slotSection.activities == null) {
								slotSection.activities = [];
							}

							slotSection.activities.push(slotActivity);
						}

						activities.ids.push(slotActivity.id);
						activities.list[slotActivity.id] = slotActivity;
					});

					// Add the combined sections to sectionGroups
					sections.ids.forEach( function(slotSectionId) {
						slotSection = sections.list[slotSectionId];
						slotSectionGroup = sectionGroups.list[slotSection.sectionGroupId];

						if (slotSectionGroup.sections == null) {
							slotSectionGroup.sections = [];
						}

						slotSectionGroup.sections.push(slotSection);
						slotSectionGroup.sections = sortSections(slotSectionGroup.sections);
					});

					// Add any shared activities to the appropriate sections
					action.payload.activities.forEach( function(slotActivity) {
						slotSection = sections.list[slotActivity.sectionId];
						slotSectionGroup = sectionGroups.list[slotActivity.sectionGroupId];

						// Check if this activity is a shared activity
						if (!slotSection && slotSectionGroup) {
							
							slotSectionGroup.sections.forEach ( function (slotSection) {
								// Scaffold section activities if necessary
								if (slotSection.activities == null) {
									slotSection.activities = [];
								}

								slotSection.activities.push(slotActivity);
							});
						}

						activities.ids.push(slotActivity.id);
						activities.list[slotActivity.id] = slotActivity;
					});

					sectionGroups.ids.forEach( function (sectionGroupId) {
						var sectionGroup = sectionGroups.list[sectionGroupId];

						if (sectionGroup.sections == null && sectionGroup.plannedSeats > 0) {
							sectionGroup.sections = [];
							sectionGroup.sections.push({id: 0});
						}
					});

					return sectionGroups;
				default:
					return sectionGroups;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);

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

sortSections = function(sections) {
	sections.sort(function (a, b) {
		// Use subject codes to sort if they don't match
		if (a.sequenceNumber > b.sequenceNumber) {
			return 1;
		}

		if (a.sequenceNumber < b.sequenceNumber) {
			return -1;
		}

		return -1;
	});

	return sections;
};
