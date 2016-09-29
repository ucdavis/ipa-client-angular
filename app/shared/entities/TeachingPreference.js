angular.module('teachingPreference', [])

.factory('TeachingPreference', ['$http', function($http) {
	function TeachingPreference(teachingPreferenceData) {
		if (teachingPreferenceData) {
			this.setData(teachingPreferenceData);
		}
	}
	TeachingPreference.prototype = {
			setData: function(teachingPreferenceData) {
				angular.extend(this, teachingPreferenceData);
			}
	};
	return TeachingPreference;
}]);
