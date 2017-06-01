/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
budgetApp.controller('BudgetCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', '$timeout',
		this.BudgetCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $timeout) {
			console.log("I am the budget controller");
	}]);

BudgetCtrl.getPayload = function ($route, $window) {
	console.log("I am the budget payload");
	return null;
};


$(function() {
    $(".description-row").find(".row").hide();
    $("table").click(function(event) {
        event.stopPropagation();
        var $target = $(event.target);
        $target.closest("tr").next().find(".row").slideToggle();
    });


	$('.form-group').find("span").bind('dblclick',function(){
		$(this).attr('contentEditable',true);
    });


});

