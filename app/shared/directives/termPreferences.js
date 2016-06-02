sharedApp.directive("termPreferences", this.termPreferences = function(courseOfferingService, teachingPreferenceService, $uibModal, courseService, ngNotify, userService) {
	return {
		restrict: 'A',
		templateUrl: 'termPreferences.html',
		scope: {
			preference: '=',
			courses: '=',
			scheduleId: '=',
			term: '=',
			instructorId: '=',
			hiddenCourseOfferingIds: '@',
			hiddenCourses: '@',
			disableSabbatical: '=?',
			sabbaticalDisableMessage: '@',
			readOnly: '=',
			onSelect: '&',
			onDelete: '&',
			onUpdate: '&'
		},
		link: function(scope, element, attrs) {
			scope.status = {};
			scope.deletable = (typeof attrs.onDelete != 'undefined');
			scope.getDescription = function(preference) {
				if (typeof preference === 'undefined') return 'Add';
				else if (preference.isBuyout) return 'Buyout';
				else if (preference.isSabbatical) return 'Sabbatical';
				else if (preference.isCourseRelease) return 'Course Release';
				else if (preference.courseOffering) {
					var courseOffering = courseOfferingService.getInstanceById(preference.courseOffering.id);
					return courseOffering.subjectCode + ' ' + courseOffering.courseNumber;
				}
				else if (preference.course) {
					return preference.course.subjectCode + ' ' + preference.course.courseNumber;
				}
			}

			scope.$watchGroup(['status.dropDownIsOpen','status.confirmIsOpen'], function(newVal) {
				if (newVal) element.addClass('disable-sorting');
				else element.removeClass('disable-sorting');
			});

			scope.addUnscheduledCourseModal = function() {
				modalInstance = $uibModal.open({
					templateUrl: 'modalAddUnscheduledCourse.html',
					controller: ModalAddUnscheduledCourseCtrl,
					resolve: {
						term: function () {
							return scope.term;
						},
						hiddenCourses: function() {
							var hiddenCourses = [];
							try {
								hiddenCourses = JSON.parse(scope.hiddenCourses);
							} catch(e) {
								console.error("addUnscheduledCourseModal was passed invalid hiddenCourses JSON", scope.hiddenCourses, e);
							}
							return hiddenCourses;
						}
					}
				});

				modalInstance.result.then(function (newCourse) {
					// find or create course
					courseService.addCourse(newCourse).then(function(course) {
						var isBuyout;
						var isSabbatical;
						var isCourseRelease;

						scope.addPreferenceByCourse(course, scope.term, isBuyout, isSabbatical, isCourseRelease)
					}, function() {
						ngNotify.set("Error finding course", "error");
					});

				}, function () {
				});

				scope.addPreferenceByCourse = function(course, term, isBuyout, isSabbatical, isCourseRelease) {

					var instructor = {};
					instructor.id = scope.instructorId;
					var isApproved = false;
					teachingPreferenceService.addInstructorTeachingPreferenceByCourse(course, term, scope.scheduleId, isBuyout, isSabbatical, isCourseRelease, instructor, isApproved)
					.then(function(res){
						scope.onUpdate();
						ngNotify.set("Added preference successfully",'success');
					}, function() {
						ngNotify.set("Error adding preference",'error');
					});
				};

			};
		}
	};
});
