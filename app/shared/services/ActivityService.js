/**
 * @ngdoc service
 * @name ipaClientAngularApp.ActivityService
 * @description
 */
class ActivityService {
	constructor () {
		return {
			dayIndicatorToDayCodes: function (dayIndicator) {
				let dayCodes = "";
				// Handle incorrect data
				if (!dayIndicator || dayIndicator.length === 0) {
					return dayCodes;
				}

				let dayStrings = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];

				for (var i = 0; i < dayIndicator.length; i++) {
					let char = dayIndicator.charAt(i);
					if (Number(char) == 1) {
						dayCodes += dayStrings[i];
					}
				}

				return dayCodes;
			}
		};
	}
}

export default ActivityService;
