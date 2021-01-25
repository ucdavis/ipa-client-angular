import './convertSectionsModal.css';
import { isNumber, isLetter } from 'shared/helpers/types';

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

      scope.convertCourseOffering = function () {
        CourseActionCreators.convertCourseOffering(scope.workgroupId, scope.year, scope.selectedEntity, scope.selectedEntity.sequencePattern.toUpperCase());
        scope.isVisible = false;
      };

      scope.close = function() {
        scope.isVisible = false;
      };

      scope.isSeries = function () {
        if (scope.selectedEntity){
          let selectedEntity = scope.selectedEntity;
          let course = scope.state.courses.list[selectedEntity.courseId];
          if (course){
            return course.isSeries();
          } else {
            return false;
          }
        }
        return false;
      };

      scope.isValid = function () {
        var isValid = false;
        if (scope.selectedEntity && scope.selectedEntity.sequencePattern){
          if (!scope.isSeries()){
            if (scope.selectedEntity.sequencePattern.length === 1 && isLetter(scope.selectedEntity.sequencePattern[0].toUpperCase())){
              isValid = true;
            } else {
              scope.selectedEntity.sequencePatternTooltipMessage = "Sequence pattern format is incorrect. Valid format is '1 letter' (ex: 'A').";
              isValid = false;
            }
          } else {
            if (
              scope.selectedEntity.sequencePattern.length === 3 &&
              isNumber(scope.selectedEntity.sequencePattern[0]) &&
              isNumber(scope.selectedEntity.sequencePattern[1]) &&
              isNumber(scope.selectedEntity.sequencePattern[2])
            ){
              isValid = true;
            } else {
              scope.selectedEntity.sequencePatternTooltipMessage = "Sequence pattern format is incorrect. Valid format is '3 numbers' (ex: '002').";
              isValid = false;
            }
          }
        }
        return isValid;
      };
    } // end link
  };
};

export default convertSectionsModal;
