import './convertSectionsModal.css';

let convertSectionsModal = function ($rootScope, CourseActionCreators) {
  return {
    restrict: 'E',
    template: require('./convertSectionsModal.html'),
    replace: true,
    scope: {
      selectedEntity: '<',
      sequencePattern: '<',
      isVisible: '='
    },
    link: function (scope) {

      scope.updateCourse = function () {
        scope.selectedEntity.sequencePattern = scope.sequencePattern;
        CourseActionCreators.updateCourse(scope.selectedEntity);
        scope.isVisible = false;
      };

      scope.close = function() {
        scope.isVisible = false;
      };
    } // end link
  };
};

export default convertSectionsModal;
