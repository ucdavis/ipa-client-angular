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
	$('.testAb').find("span").bind('dblclick',function(){
		$(this).attr('contentEditable',true);
    });


    $('#courses-pivot').on('click', function(e) {
            console.log('showing courses');
            $('#courses-table').show();
            $('#instructors-table').hide();
    });
    $('#instructors-pivot').click(function(e) {
            console.log('showing instructors');
            $('#courses-table').hide();
            $('#instructors-table').show();
    });

    //arrow rotation when collapse
    $('#instructional-panel').click(function(){
			var arrowIcon1 = $('.glyphicon-triangle-left', this);
			arrowIcon1.toggleClass('glyphicon-triangle-left-spin');
    });

    $('#line-item-panel').click(function(){
			var arrowIcon2 = $('.glyphicon-triangle-left', this);
			arrowIcon2.toggleClass('glyphicon-triangle-left-spin');
    });


    $('.budget-table tr').click(function() {
        var arrowIcon3 = $('.glyphicon-triangle-left', this);
        arrowIcon3.toggleClass('glyphicon-triangle-left-spin');
    });


});

//TA&Reader Cost input
$(function() {
		var $form = $( "#cost-input-form" );
		var $input = $form.find( "input" );

		$input.on( "keyup", function( event ) {
			// When user select text in the document, also abort.
			var selection = window.getSelection().toString();
			if ( selection !== '' ) {
				return;
			}
			// When the arrow keys are pressed, abort.
			if ( $.inArray( event.keyCode, [38,40,37,39] ) !== -1 ) {
				return;
			}
			var $this = $( this );
			// Get the value.
			var input = $this.val();
			var input = input.replace(/[\D\s\._\-]+/g, "");
					input = input ? parseInt( input, 10 ) : 0;

					$this.val( function() {
						return ( input === 0 ) ? "" : input.toLocaleString( "en-US" );
					} );
		} );
	});

