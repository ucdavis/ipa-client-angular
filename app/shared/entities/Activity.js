angular.module('activity', [])

.factory('Activity', ['$http', function($http) {
	function Activity(activityData) {
		if (activityData) {
			this.setData(activityData);
			this.setStandardTimes();
			this.setBannerRoom();
			this.setSelectedDuration();
		}
	};
	Activity.prototype = {
		setData: function(activityData) {
			angular.extend(this, activityData);
		},
		/**
		 * Returns the human readable code description
		 */
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
		},
		getStandardTimes: function () {
			return {
				50: {
					dayIndicators: ['0101000', '0010100', '0101010', '0111100', '0111010'],
					times: [
						{ start: '08:00:00', end: '08:50:00' },
						{ start: '09:00:00', end: '09:50:00' },
						{ start: '10:00:00', end: '10:50:00' },
						{ start: '11:00:00', end: '11:50:00' },
						{ start: '12:10:00', end: '13:00:00' },
						{ start: '13:10:00', end: '14:00:00' },
						{ start: '14:10:00', end: '15:00:00' },
						{ start: '15:10:00', end: '16:00:00' },
						{ start: '16:10:00', end: '17:00:00' },
						{ start: '17:10:00', end: '18:00:00' },
						{ start: '18:10:00', end: '19:00:00' },
						{ start: '19:10:00', end: '20:00:00' },
						{ start: '20:10:00', end: '21:00:00' },
						{ start: '21:10:00', end: '22:00:00' }
					]
				},
				80: {
					dayIndicators: ['0010100'],
					times: [
						{ start: '07:30:00', end: '08:50:00' },
						{ start: '09:00:00', end: '10:20:00' },
						{ start: '10:30:00', end: '11:50:00' },
						{ start: '12:10:00', end: '13:30:00' },
						{ start: '12:10:00', end: '13:30:00' },
						{ start: '13:40:00', end: '15:00:00' },
						{ start: '15:10:00', end: '16:30:00' },
						{ start: '16:40:00', end: '18:00:00' },
						{ start: '18:10:00', end: '19:30:00' },
						{ start: '19:40:00', end: '21:00:00' }
					]
				},
				110: {
					dayIndicators: ['0101000', '0010100'],
					times: [
						{ start: '08:00:00', end: '09:50:00' },
						{ start: '10:00:00', end: '11:50:00' },
						{ start: '12:10:00', end: '14:00:00' },
						{ start: '14:10:00', end: '16:00:00' },
						{ start: '16:10:00', end: '18:00:00' },
						{ start: '18:10:00', end: '20:00:00' },
						{ start: '20:10:00', end: '22:00:00' }
					]
				}
			};
		},
		getMeridianTime: function(time) {
			if (!time) {
				return {hours: '--', minutes: '--', meridian: '--'};
			}

			var timeArr = time.split(':');

			var hours = parseInt(timeArr[0]);
			if (hours === 0) hours = 12;
			else if (hours > 12) hours = hours % 12;

			var minutes = parseInt(timeArr[1]);
			var meridian = timeArr[0] < 12 ? 'AM' : 'PM';

			return {hours: hours, minutes: minutes, meridian: meridian};
		},
		/**
		 * Sets the 'isStandardTimes' property on the activity if the times match
		 * one of the registrar's standard time patterns'
		 */
		setStandardTimes: function () {
			standardTimePatterns = this.getStandardTimes();

			if (parseInt(this.frequency) !== 1 || !this.startTime || !this.endTime) { return false; }

			// Get time difference in minutes
			var start = this.startTime.split(':').map(Number);
			var end = this.endTime.split(':').map(Number);
			var timeDiff = (end[0] - start[0]) * 60 + (end[1] - start[1]);

			var pattern = standardTimePatterns[timeDiff] || {dayIndicators: []};
			var isStandard = false;

			outerloop:
			for (var d = 0; d < pattern.dayIndicators.length; d++) {
				if (pattern.dayIndicators[d] === this.dayIndicator){
					for (var t = 0; t < pattern.times.length; t++) {
						if(pattern.times[t].start === this.startTime && pattern.times[t].end === this.endTime) {
							isStandard = true;
							break outerloop;
						}
					}
				}
			}

			this.isStandardTimes = isStandard;
		},
		/**
		 * Sets the 'isBannerRoom' to true if location is null and the activity is not virtual
		 */
		setBannerRoom: function () {
			this.isBannerRoom = !this.locationId && !this.virtual;
		},
		setSelectedDuration: function () {
			var start = moment(this.startTime, "HH:mm:ss");
			var end = moment(this.endTime, "HH:mm:ss");
			var duration = moment.duration(end.diff(start));
			this.selectedDuration = duration.asMinutes().toString();
		}
	};
	return Activity;
}]);
