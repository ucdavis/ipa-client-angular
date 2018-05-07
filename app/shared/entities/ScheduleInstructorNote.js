const ScheduleInstructorNote = angular.module('ScheduleInstructorNote', [])

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

export default ScheduleInstructorNote;