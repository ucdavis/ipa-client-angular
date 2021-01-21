import './convertSectionsModal.css';

let convertSectionsModal = function (CourseActionCreators) {
  return {
    restrict: 'E',
    template: require('./convertSectionsModal.html'),
    replace: true,
    scope: {
      workgroupId: '<',
      year: '<',
      selectedEntity: '<',
      isVisible: '='
    },
    link: function (scope) {
      scope.sequencePattern = '';

      scope.convertCourseOffering = function () {
        console.log(scope);
        CourseActionCreators.convertCourseOffering(scope.workgroupId, scope.year, scope.selectedEntity, scope.sequencePattern);
        scope.isVisible = false;
      };

      scope.close = function() {
        scope.isVisible = false;
      };
    } // end link
  };
};

export default convertSectionsModal;
