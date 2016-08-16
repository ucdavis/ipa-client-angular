angular.module('activity', [])

.factory('Activity', ['$http', function($http) {
	function Activity(activityData) {
		if (activityData) {
			this.setData(activityData);
		}
	};
	Activity.prototype = {
		setData: function(activityData) {
			angular.extend(this, activityData);
		},
		getCodeDescription: function () {
			var codeDescriptions = {
				'%': "World Wide Web Electronic Discussion",
				'0': "World Wide Web Virtual Lecture",
				'1': "Conference",
				'2': "Term Paper/Discussion",
				'3': "Film Viewing",
				'6': "Dummy Course",
				'7': "Combined Schedule",
				'8': "Project",
				'9': "Extensive Writing or Discussion",
				'A': "Lecture",
				'B': "Lecture/Discussion",
				'C': "Laboratory",
				'D': "Discussion",
				'E': "Seminar",
				'F': "Fieldwork",
				'G': "Discussion/Laboratory",
				'H': "Laboratory/Discussion",
				'I': "Internship",
				'J': "Independent Study",
				'K': "Workshop",
				'L': "Lecture/Lab",
				'O': "Clinic",
				'P': "PE Activity",
				'Q': "Listening",
				'R': "Recitation",
				'S': "Studio",
				'T': "Tutorial",
				'U': "Auto Tutorial",
				'V': "Variable",
				'W': "Practice",
				'X': "Performance Instruction",
				'Y': "Rehearsal",
				'Z': "Term Paper"
			};
			return codeDescriptions[this.activityTypeCode.activityTypeCode];
		}
	};
	return Activity;
}]);
