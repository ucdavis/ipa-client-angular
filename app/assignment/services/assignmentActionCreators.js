'use strict';

/**
 * @ngdoc service
 * @name workgroupApp.workgroupActionCreators
 * @description
 * # workgroupActionCreators
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
assignmentApp.service('assignmentActionCreators', function (assignmentStateService, assignmentService, $rootScope, Role) {
	return {
		getInitialState: function (workgroupId, year) {
			assignmentService.getInitialState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_ASSIGNMENT_VIEW,
					payload: payload
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		addInstructorAssignment: function (sectionGroupId, instructorId) {
			assignmentService.addInstructorAssignment(sectionGroup).then(function (sectionGroup) {
				$rootScope.$emit('toast', {message: "Assigned instructor to course", type: "SUCCESS"});
				var action = {
					type: ADD_INSTRUCTOR_ASSIGNMENT,
					payload: {
						instructorId: instructorId
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		removeInstructorAssignment: function (teachingAssignment) {
			assignmentService.removeInstructorAssignment(sectionGroupId, instructorId).then(function (sectionGroupId) {
				$rootScope.$emit('toast', {message: "Removed instructor from course", type: "SUCCESS"});
				var action = {
					type: REMOVE_TEACHING_ASSIGNMENT,
					payload: {
						sectionGroup: sectionGroup
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		addAndApproveInstructorAssignment: function (teachingAssignment) {
			assignmentService.addInstructorAssignment(teachingAssignment).then(function (teachingAssignment) {
				$rootScope.$emit('toast', {message: "Assigned instructor to course", type: "SUCCESS"});
				var action = {
					type: ADD_TEACHING_ASSIGNMENT,
					payload: {
						teachingAssignment: teachingAssignment
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		approveInstructorAssignment: function (teachingAssignment) {
			teachingAssignment.approved = true;

			assignmentService.updateInstructorAssignment(teachingAssignment).then(function (teachingAssignment) {
				$rootScope.$emit('toast', {message: "Assigned instructor to course", type: "SUCCESS"});
				var action = {
					type: UPDATE_TEACHING_ASSIGNMENT,
					payload: {
						teachingAssignment: teachingAssignment
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		unapproveInstructorAssignment: function (teachingAssignment) {
			teachingAssignment.approved = false;
			assignmentService.updateInstructorAssignment(teachingAssignment).then(function (teachingAssignment) {
				$rootScope.$emit('toast', {message: "Removed instructor from course", type: "SUCCESS"});
				var action = {
					type: UPDATE_TEACHING_ASSIGNMENT,
					payload: {
						teachingAssignment: teachingAssignment
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		}
	}
});