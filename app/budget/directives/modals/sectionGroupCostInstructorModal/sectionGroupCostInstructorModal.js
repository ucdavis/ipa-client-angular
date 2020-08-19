import './sectionGroupCostInstructorModal.css';

let sectionGroupCostInstructorModal = function () {
  return {
    restrict: 'E',
    template: require('./sectionGroupCostInstructorModal.html'),
    replace: true,
    scope: {
      sectionGroupCostToEdit: '<?'
    },
    link: function (scope) {

      scope.close = function () {
        scope.isVisible = false;
      };

    },
  };
};

export default sectionGroupCostInstructorModal;