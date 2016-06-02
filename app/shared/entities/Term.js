angular.module('term', [])

.factory('Term', ['$http', function($http) {
	function Term(termData) {
		if (termData) {
			this.setData(termData);
		}
	};
	Term.prototype = {
			setData: function(termData) {
				angular.extend(this, termData);
			}
	};
	return Term;
}]);
