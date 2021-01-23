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
      isVisible: '=',
      state: '='
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

      scope.isSeries = function () {
        if(scope.selectedEntity){
          let selectedEntity = scope.selectedEntity;
          let course = scope.state.courses.list[selectedEntity.courseId];
          return course.isSeries();
        }
        return false;
      };
    } // end link
  };
};

export default convertSectionsModal;
