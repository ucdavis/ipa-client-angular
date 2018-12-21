 // eslint-disable-next-line no-undef
const TeachingPreference = angular.module('TeachingPreference', [])

.factory('TeachingPreference', ['$http', function($http) {
	function TeachingPreference(teachingPreferenceData) {
		if (teachingPreferenceData) {
			this.setData(teachingPreferenceData);
		}
	}
	TeachingPreference.prototype = {
			setData: function(teachingPreferenceData) {
				angular.extend(this, teachingPreferenceData); // eslint-disable-line no-undef
			}
	};
	return TeachingPreference;
}]);

export default TeachingPreference;