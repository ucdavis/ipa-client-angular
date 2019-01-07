import './contact-instructors-modal.css';

let contactInstructorsModal = function (TermService, TeachingCallStatusActionCreators) {
	return {
		restrict: 'E',
		template: require('./contactInstructorsModal.html'),
		replace: true,
		scope: {
			state: '<',
      year: '<',
      workgroupId: '<',
      isVisible: '='
		},
		link: function (scope) {
      scope.startTeachingCallConfig = {};
      scope.startTeachingCallConfig.dueDate = new Date();
      scope.startTeachingCallConfig.showUnavailabilities = true;
      scope.startTeachingCallConfig.message = "Please consider your teaching for next year in light of what you have taught in recent years.";
      scope.startTeachingCallConfig.message += " As always, we will attempt to accommodate your requests, but we may need to ask some of you to make changes in order to balance our course offerings effectively.";
    
      scope.nextYear = (parseInt(scope.year) + 1).toString().slice(-2);
      scope.selectedInstructorIds = scope.state.ui.selectedInstructorIds;
    
      scope.startTeachingCallConfig.selectedInstructors = [];
    
      scope.state.teachingCallReceipts.ids.forEach(function(teachingCallReceiptId) {
        var teachingCallReceipt = scope.state.teachingCallReceipts.list[teachingCallReceiptId];
    
        if (scope.selectedInstructorIds.indexOf(teachingCallReceipt.instructorId) > -1) {
          scope.startTeachingCallConfig.selectedInstructors.push(teachingCallReceipt);
        }
      });

      scope.allTerms = {
        '05': 'Summer Session 1',
        '06': 'Summer Special Session',
        '07': 'Summer Session 2',
        '08': 'Summer Quarter',
        '09': 'Fall Semester',
        '10': 'Fall Quarter',
        '01': 'Winter Quarter',
        '02': 'Spring Semester',
        '03': 'Spring Quarter'
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
        if (type == 'start') {
          scope.opened.start = true;
        }
        if (type == 'end') {
          scope.opened[id].end = true;
        }
      };
    
      scope.start = function (emailInstructors) {
        scope.startTeachingCallConfig.emailInstructors = emailInstructors;
        $uibModalInstance.close(scope.startTeachingCallConfig); // eslint-disable-line no-undef
      };
    
      scope.cancel = function () {
        $uibModalInstance.dismiss('cancel'); // eslint-disable-line no-undef
      };
    
      scope.isFormIncomplete = function () {
        if (scope.startTeachingCallConfig.message !== "") {
          return false;
        }
        return true;
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
      };
    
      scope.toggleSenateInstructors = function () {
        scope.startTeachingCallConfig.sentToSenate = !scope.startTeachingCallConfig.sentToSenate;
      };
    
      scope.toggleFederationInstructors = function () {
        scope.startTeachingCallConfig.sentToFederation = !scope.startTeachingCallConfig.sentToFederation;
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
        showWeeks: false,
        initDate: new Date()
      };
    
      scope.popup1 = {};
      scope.open1 = function() {
        scope.popup1.opened = true;
      };
    
      scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy-MM-dd'];
      scope.format = scope.formats[4];
      scope.altInputFormats = ['M!/d!/yyyy'];
    
      scope.submit = function() {
        var messageInput = $('.teaching-call-message-input').val(); // eslint-disable-line no-undef
        scope.startTeachingCallConfig.message = messageInput.replace(/\r?\n/g, '<br />');

        scope.contactInstructors();
      };

      scope.contactInstructors = function() {
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
  
        TeachingCallStatusActionCreators.contactInstructors(scope.workgroupId, scope.year, scope.startTeachingCallConfig, scope.startTeachingCallConfig.selectedInstructors);
      };
    }
	};
};

export default contactInstructorsModal;
