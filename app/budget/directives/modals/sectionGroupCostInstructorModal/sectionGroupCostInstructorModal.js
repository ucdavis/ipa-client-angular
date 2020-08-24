import './sectionGroupCostInstructorModal.css';

let sectionGroupCostInstructorModal = function (BudgetActions) {
  return {
    restrict: 'E',
    template: require('./sectionGroupCostInstructorModal.html'),
    replace: true,
    scope: {
      sectionGroupCostToEdit: '<?'
    },
    link: function (scope) {

      console.log('Modal scope ', scope);
      scope.instructors = [];

      scope.close = function () {
        scope.isVisible = false;
      };

      scope.updateInstructorCost = function (sectionGroupCostId, instructor) {
        console.log('Updating cost ', instructor);
        // We already have an entry for this user
        if (instructor.sectionGroupCostInstructorId){
          console.log('Skipping, already exists');
        } else {
          var sectionGroupCost = {
            instructorId: instructor.id,
            cost: parseFloat(instructor.cost.replace(/\D/g,'')),
            sectionGroupCostId: sectionGroupCostId
          };
          BudgetActions.createSectionGroupCostInstructor(sectionGroupCost);
        }
      };

    },
  };
};

export default sectionGroupCostInstructorModal;