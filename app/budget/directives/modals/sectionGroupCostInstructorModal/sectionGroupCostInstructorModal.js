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

      // TODO dont use watch
      scope.$watch("sectionGroupCostToEdit", function(sectionGroupCostToEdit) {
          console.log("seciton group changed", sectionGroupCostToEdit);
          if (sectionGroupCostToEdit){
            var instructors = Object.assign({}, ...sectionGroupCostToEdit.sectionGroup.assignedInstructors.map((x) => ({[x.id]: x})));
            sectionGroupCostToEdit.sectionGroupCostInstructors.forEach(function (sectionGroupCostInstructor){
              if (instructors[sectionGroupCostInstructor.instructorId]){
                instructors[sectionGroupCostInstructor.instructorId].cost = '$' + sectionGroupCostInstructor.cost.toString();
                instructors[sectionGroupCostInstructor.instructorId].sectionGroupCostInstructorId = sectionGroupCostInstructor.id;
              }
            });
            scope.instructors = Object.keys(instructors).map(function(key){
                return instructors[key];
            });
          }
      });

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