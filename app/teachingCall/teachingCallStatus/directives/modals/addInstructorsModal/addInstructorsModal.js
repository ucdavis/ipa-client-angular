import { _array_sortByProperty } from 'shared/helpers/array';

import './add-instructors-modal.css';

let addInstructorsModal = function (TermService, TeachingCallStatusActionCreators) {
	return {
		restrict: 'E',
		template: require('./addInstructorsModal.html'),
		replace: true,
		scope: {
			state: '<',
      year: '<',
      workgroupId: '<',
      isVisible: '='
		},
		link: function (scope) {
      scope.startTeachingCallConfig = {};
      scope.startTeachingCallConfig.dueDate = "";
      scope.startTeachingCallConfig.showUnavailabilities = true;
      scope.startTeachingCallConfig.sendEmail = true;
      scope.startTeachingCallConfig.message = "Please consider your teaching for next year in light of what you have taught in recent years.";
      scope.startTeachingCallConfig.message += " As always, we will attempt to accommodate your requests, but we may need to ask some of you to make changes in order to balance our course offerings effectively.";
    
      scope.nextYear = (parseInt(scope.year) + 1).toString().slice(-2);
      scope.instructorTypes = scope.state.instructorTypes;

      scope.startTeachingCallConfig.invitedInstructors = scope.state.calculations.instructorsEligibleForCall;
      scope.startTeachingCallConfig.invitedInstructors = _array_sortByProperty(scope.startTeachingCallConfig.invitedInstructors, "lastName");

      scope.startTeachingCallConfig.invitedInstructors.forEach(function(instructor) {
        instructor.invited = false;
      });

      scope.invitedInstructorsCount = function() {
        return scope.startTeachingCallConfig.invitedInstructors.filter(function(el) { return el.invited == true; }).length;
      };

      scope.close = function() {
				scope.isVisible = false;
			};

      scope.instructorTypeUsed = function(instructorTypeId) {
        var atLeastOneInstructor = false;
    
        if (scope.startTeachingCallConfig.invitedInstructors) {
          scope.startTeachingCallConfig.invitedInstructors.forEach(function(instructor) {
            if(instructor.instructorTypeId == instructorTypeId) {
              atLeastOneInstructor = true;
            }
          });
        }
    
        return atLeastOneInstructor;
      };
    
      scope.inviteInstructorsOfType = function (instructorTypeId) {
        scope.startTeachingCallConfig.invitedInstructors.forEach(function(instructor) {
          if(instructor.instructorTypeId == instructorTypeId) {
            instructor.invited = true;
          }
        });
    
        scope.startTeachingCallConfig.isAddInstructorFormComplete = scope.isAddInstructorFormComplete();
      };
    
      scope.allInstructorTypeInvited = function (instructorTypeId) {
        var excludedInstructors = scope.startTeachingCallConfig.invitedInstructors.find(function(instructor) {
          return ((instructor.instructorTypeId == instructorTypeId) && (instructor.invited == false));
        });
    
        return !(excludedInstructors);
      };

      scope.activeTermIds = [];
      scope.view = {};
      scope.minDate = new Date();
      scope.parent = {dueDate:''};
      scope.startTeachingCallConfig.activeTerms = {};
    
      let allTerms = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
    
      for (var i = 0; i < allTerms.length; i++) {
        scope.startTeachingCallConfig.activeTerms[allTerms[i]] = false;
      }
    
      let chronologicalTerms = ['05', '06', '07', '08', '09', '10', '01', '02', '03'];
      scope.dropDownTerms = [];
      for (var i = 0; i < chronologicalTerms.length; i++) {

        var shortTerm = chronologicalTerms[i];
        var slotTerm = "";
        if (parseInt(shortTerm) < 5) {
          slotTerm = parseInt(scope.year) + 1;
        } else {
          slotTerm = scope.year;
        }
    
        slotTerm += shortTerm;
        scope.dropDownTerms.push(slotTerm);
      }
    
      scope.startTeachingCallConfig.activeTerms['01'] = true;
      scope.startTeachingCallConfig.activeTerms['03'] = true;
      scope.startTeachingCallConfig.activeTerms['10'] = true;
    
      scope.open = function($event, id, type) {
        $event.preventDefault();
        $event.stopPropagation();
        scope.opened  = {start: false, end: false};
        if(type == 'start') {
          scope.opened.start = true;
        }
        if(type == 'end') {
          scope.opened[id].end = true;
        }
      };
    
      scope.start = function (emailInstructors) {
        scope.startTeachingCallConfig.emailInstructors = emailInstructors;
        scope.submit();
      };

      scope.isAddInstructorFormComplete = function () {
        var atLeastOneInstructor = false;
        var atLeastOneTerm = false;
    
        scope.startTeachingCallConfig.invitedInstructors.forEach( function(slotInstructor) {
          if (slotInstructor.invited == true) {
            atLeastOneInstructor = true;
          }
        });
    
        Object.keys(scope.startTeachingCallConfig.activeTerms).forEach(function (key) { 
            var value = scope.startTeachingCallConfig.activeTerms[key];
            if (value == true) {
              atLeastOneTerm = true;
            }
        });
    
        return atLeastOneInstructor && atLeastOneTerm;
      };
    
      // Transforms to ISO format
      scope.saveDueDate = function () {
        if (scope.parent.dueDate !== "") {
          scope.startTeachingCallConfig.dueDate = scope.parent.dueDate.toISOString().slice(0, 10);
        }
      };
    
      scope.isTermActive = function (term) {
        if (scope.startTeachingCallConfig.activeTerms != null) {
          return scope.startTeachingCallConfig.activeTerms[term];
        }
    
        return false;
      };
    
      scope.toggleTermActive = function (term) {
        term = term.slice(-2);
        scope.startTeachingCallConfig.activeTerms[term] = !scope.startTeachingCallConfig.activeTerms[term];
        scope.startTeachingCallConfig.isAddInstructorFormComplete = scope.isAddInstructorFormComplete();
      };
    
      scope.toggleInstructor = function(instructor) {
        instructor.invited = !instructor.invited;
        scope.startTeachingCallConfig.isAddInstructorFormComplete = scope.isAddInstructorFormComplete();
      };
    
      scope.toggleSendEmail = function() {
        scope.startTeachingCallConfig.sendEmail = !scope.startTeachingCallConfig.sendEmail;
      };
    
      scope.getTermName = function(term) {
        return TermService.getTermName(term);
      };
    
      // Datepicker config
      scope.inlineOptions = {
        minDate: new Date(),
        showWeeks: true
      };
    
      scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1,
        showWeeks: false
      };
    
      scope.popup1 = {};
      scope.open1 = function() {
        scope.popup1.opened = true;
      };
    
      scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy-MM-dd'];
      scope.format = scope.formats[4];
      scope.altInputFormats = ['M!/d!/yyyy'];
    
      scope.submit = function() {
        var messageInput = $('.teaching-call-message-input').val();
        if (messageInput) {
          scope.startTeachingCallConfig.message = messageInput.replace(/\r?\n/g, '<br />');
        }

        scope.startTeachingCallConfig.termsBlob = "";
        var allTerms = ['01','02','03','04','05','06','07','08','09','10'];
  
        for (var i = 0; i < allTerms.length; i++) {
          if (scope.startTeachingCallConfig.activeTerms[allTerms[i]] === true) {
            scope.startTeachingCallConfig.termsBlob += "1";
          } else {
            scope.startTeachingCallConfig.termsBlob += "0";
          }
        }

        delete scope.startTeachingCallConfig.activeTerms;

        TeachingCallStatusActionCreators.addInstructorsToTeachingCall(scope.workgroupId, scope.year, scope.startTeachingCallConfig);
        scope.close();
      };

      scope.startTeachingCallConfig.isAddInstructorFormComplete = scope.isAddInstructorFormComplete();
    }
	};
};

export default addInstructorsModal;
