angular.module('scheduleInstructorNote', [])

.factory('ScheduleInstructorNote', ['$http', function($http) {
	function ScheduleInstructorNote(scheduleInstructorNoteData) {
		if (scheduleInstructorNoteData) {
			this.setData(scheduleInstructorNoteData);
		}
	}
	ScheduleInstructorNote.prototype = {
			setData: function(scheduleInstructorNoteData) {
				angular.extend(this, scheduleInstructorNoteData);
			}
	};
	return ScheduleInstructorNote;
}]);
