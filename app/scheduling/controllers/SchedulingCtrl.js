/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:SchedulingCtrl
 * @description
 * # SchedulingCtrl
 * Controller of the ipaClientAngularApp
 */
class SchedulingCtrl {
	constructor ($scope, $rootScope, $route, $routeParams, Activity, Term, SchedulingActionCreators, AuthService) {
		var self = this;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.Activity = Activity;
		this.Term = Term;
		this.SchedulingActionCreators = SchedulingActionCreators;
		this.AuthService = AuthService;

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.termShortCode = $routeParams.termShortCode;
		$scope.view = {
			addSharedActivityPopoverIsOpen: {},
			addActivityPopoverIsOpen: {}
		};

		$scope.days = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];
		// Meeting codes in the order of popularity
		$scope.allActivityTypes = [
			'V', 'D', 'A', 'I', 'C', 'T', 'J', 'B', 'E', 'H',
			'O', 'G', '8', 'S', 'F', '2', 'X', 'L', '9', 'Y',
			'0', '1', '3', 'K', '%', 'W', '6', 'U', 'Q', 'R',
			'P', '7', 'Z'
		];

		self.initialize();
	}

	initialize () {
		var self = this;
		this.$scope.getWeekDays = function(dayIndicator) {
			if (!dayIndicator) {
				return "";
			}

			return dayIndicator.getWeekDays();
		};

		self.$scope.standardPatterns = self.Activity.prototype.getStandardTimes();

		self.$rootScope.$on('schedulingStateChanged', function (event, data) {
			self.$scope.view.state = data.state;
		});

		this.$scope.setSelectedSectionGroup = function (sectionGroupId) {
			var sectionGroup = self.$scope.view.state.sectionGroups.list[sectionGroupId];
			self.SchedulingActionCreators.setSelectedSectionGroup(sectionGroup);
			self.$scope.getSectionGroupDetails(sectionGroupId);
		};

		this.$scope.toggleCheckedSectionGroup = function (sectionGroupId, event) {
			event.stopPropagation();
			self.SchedulingActionCreators.toggleCheckedSectionGroup(sectionGroupId);
			self.$scope.getSectionGroupDetails(sectionGroupId);
		};

		this.$scope.setSelectedActivity = function (activityId) {
			var activity = self.$scope.view.state.activities.list[activityId];
			self.SchedulingActionCreators.setSelectedActivity(activity);
		};

		this.$scope.getSectionGroupDetails = function (sectionGroupId) {
			var sectionGroup = self.$scope.view.state.sectionGroups.list[sectionGroupId];
			var course = self.$scope.view.state.courses.list[sectionGroup.courseId];

			// Initialize course activity types if not done already
			if (course && course.activityTypes === undefined) {
				self.SchedulingActionCreators.getCourseActivityTypes(course);
			}
		};

		self.$scope.getMeridianTime = function (time) {
			if (!time) {
				return "";
			}

			time = Activity.prototype.getMeridianTime(time);
			return ('0' + time.hours).slice(-2) + ':' + ('0' + time.minutes).slice(-2) + ' ' + time.meridian;
		};

		self.$scope.toggleCalendarDay = function (index) {
			self.SchedulingActionCreators.toggleDay(index);
		};

		self.$scope.toggleTagFilter = function (tagId) {
			var tagFilters = self.$scope.view.state.filters.enabledTagIds;
			var tagIndex = tagFilters.indexOf(tagId);

			if (tagIndex < 0) {
				tagFilters.push(tagId);
			} else {
				tagFilters.splice(tagIndex, 1);
			}

			self.SchedulingActionCreators.updateTagFilters(tagFilters);
		};

		self.$scope.toggleLocationFilter = function (locationId) {
			var locationFilters = self.$scope.view.state.filters.enabledLocationIds;
			var locationIndex = locationFilters.indexOf(locationId);

			if (locationIndex < 0) {
				locationFilters.push(locationId);
			} else {
				locationFilters.splice(locationIndex, 1);
			}

			self.SchedulingActionCreators.updateLocationFilters(locationFilters);
		};

		self.$scope.toggleInstructorFilter = function (instructorId) {
			var instructorFilters = self.$scope.view.state.filters.enabledInstructorIds;
			var instructorIndex = instructorFilters.indexOf(instructorId);

			if (instructorIndex < 0) {
				instructorFilters.push(instructorId);
			} else {
				instructorFilters.splice(instructorIndex, 1);
			}

			self.SchedulingActionCreators.updateInstructorFilters(instructorFilters);
		};

		self.$scope.toggleActivityDay = function (index) {
			var activity = self.$scope.view.state.activities.list[self.$scope.view.state.uiState.selectedActivityId];
			var dayArr = activity.dayIndicator.split('');
			dayArr[index] = Math.abs(1 - parseInt(dayArr[index])).toString();
			activity.dayIndicator = dayArr.join('');
			self.$scope.saveActivity();
		};

		self.$scope.setActivityStandardTime = function (time) {
			var activity = self.$scope.view.state.activities.list[self.$scope.view.state.uiState.selectedActivityId];
			activity.frequency = 1;
			activity.startTime = time ? time.start : null;
			activity.endTime = time ? time.end : null;
			self.$scope.saveActivity();
		};

		self.$scope.saveActivity = function () {
			var activity = self.$scope.view.state.activities.list[self.$scope.view.state.uiState.selectedActivityId];

			if (activity.frequency < 1) {
				activity.frequency = 1;
			}

			if (activity.dayIndicator) {
				self.SchedulingActionCreators.updateActivity(activity);
			}
		};

		self.$scope.setDayPattern = function(dayPattern) {
			if (!dayPattern) {
				var activity = self.$scope.view.state.activities.list[self.$scope.view.state.uiState.selectedActivityId];
				activity.endTime = null;
				activity.startTime = null;

				self.SchedulingActionCreators.updateActivity(activity);
			}
		};

		self.$scope.removeActivity = function (activity) {
			self.SchedulingActionCreators.removeActivity(activity);
		};

		self.$scope.removeSection = function (section) {
			self.SchedulingActionCreators.removeSection(section);
		};

		self.$scope.createSharedActivity = function (activityCode, sectionGroup) {
			self.SchedulingActionCreators.createSharedActivity(activityCode, sectionGroup);
			self.$scope.view.addSharedActivityPopoverIsOpen[sectionGroup.id] = false;
		};

		self.$scope.createActivity = function (activityCode, sectionId, sectionGroup) {
			self.SchedulingActionCreators.createActivity(activityCode, sectionId, sectionGroup);
			self.$scope.view.addActivityPopoverIsOpen[sectionId] = false;
		};

		self.$scope.closeActivityDetails = function () {
			self.SchedulingActionCreators.setSelectedActivity();
		};

		self.$scope.toggleCheckAll = function () {
			var sectionGroupIdsToCheck = self.$scope.view.state.sectionGroups.ids.filter(function (sgId) {
				return self.$scope.matchesFilters(self.$scope.view.state.sectionGroups.list[sgId]);
			});
			self.SchedulingActionCreators.toggleCheckAll(sectionGroupIdsToCheck);
		};

		self.$scope.calculateNextSequenceNumber = function(sectionGroup) {
			if (!sectionGroup) {
				return null;
			}

			var course = self.$scope.view.state.courses.list[sectionGroup.courseId];
			var sectionGroup = self.$scope.view.state.sectionGroups.list[sectionGroup.id];
			var sections = [];

			sectionGroup.sectionIds.forEach(function(sectionId) {
				sections.push(self.$scope.view.state.sections.list[sectionId]);
			});

			return nextSequenceNumber(course, sectionGroup, sections);
		};

		self.$scope.createSection = function (sectionGroup) {
			var section = {
				sectionGroupId: sectionGroup.id,
				sequenceNumber: self.$scope.calculateNextSequenceNumber(sectionGroup),
				seats: 0
			};

			self.SchedulingActionCreators.createSection(section);
		};

		// Return true if the user does not have write access
		self.$scope.isLocked = function () {
			// Keep UI locked while state is still loading
			if (!self.$scope.view.state) { return true; }

			var hasAuthorizedRole = self.$scope.sharedState.currentUser.isAdmin() ||
				self.$scope.sharedState.currentUser.hasRole('academicPlanner', self.$scope.sharedState.workgroup.id);
			return !(hasAuthorizedRole);
		};

		self.$scope.activityMatchesFilters = function (activityId) {
			// When filter is off, all activities match
			if (self.$scope.view.state.filters.enabledLocationIds.length === 0) {
				return true;
			}

			var locationId = self.$scope.view.state.activities.list[activityId].locationId;

			return (self.$scope.view.state.filters.enabledLocationIds.indexOf(locationId) >= 0);
		};

		self.$scope.matchesFilters = function (sectionGroup) {
			var satisfiesTagFilters = (
				self.$scope.view.state.filters.enabledTagIds.length === 0 ||
				self.$scope.view.state.courses.list[sectionGroup.courseId].matchesTagFilters
			);

			var satisfiesLocationFilters = (
				self.$scope.view.state.filters.enabledLocationIds.length === 0 ||
				matchesLocationFilters(sectionGroup)
			);

			var satisfiesInstructorFilters = (
				self.$scope.view.state.filters.enabledInstructorIds.length === 0 ||
				matchesInstructorFilters(sectionGroup)
			);

			return satisfiesTagFilters && satisfiesLocationFilters && satisfiesInstructorFilters;
		};

		var matchesLocationFilters = function (sectionGroup) {
			var sectionGroupLocationIds = self.$scope.view.state.activities.ids
				.filter(function (activityId) {
					return self.$scope.view.state.activities.list[activityId].sectionGroupId == sectionGroup.id;
				}).map(function (activityId) {
					return self.$scope.view.state.activities.list[activityId].locationId;
				});

			return self.$scope.view.state.filters.enabledLocationIds.some(function (locationId) {
				return sectionGroupLocationIds.indexOf(locationId) >= 0;
			});
		};

		var matchesInstructorFilters = function (sectionGroup) {
			return self.$scope.view.state.filters.enabledInstructorIds.some(function (instructorId) {
				return sectionGroup.instructorIds.indexOf(instructorId) >= 0;
			});
		};
	}
}

SchedulingCtrl.$inject = ['$scope', '$rootScope', '$route', '$routeParams', 'Activity', 'Term', 'SchedulingActionCreators', 'AuthService'];

export default SchedulingCtrl;

