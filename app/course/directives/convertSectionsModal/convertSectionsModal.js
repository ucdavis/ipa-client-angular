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
              scope.selectedEntity.sequencePatternTooltipMessage = null;
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
              scope.selectedEntity.sequencePatternTooltipMessage = null;
              isValid = true;
            } else {
              scope.selectedEntity.sequencePatternTooltipMessage = "Sequence pattern format is incorrect. Valid format is '3 numbers' (ex: '002').";
              isValid = false;
            }
          }
        }
        return isValid;
      };

      scope.isUnique = function () {
        var isUnique = false;
        if (scope.selectedEntity && scope.selectedEntity.sequencePattern){
          var sectionGroup = scope.selectedEntity;
          var course = course = scope.state.courses.list[sectionGroup.courseId];
          var courseDescription = course.subjectCode + "-" + course.courseNumber + "-" + sectionGroup.sequencePattern;
          isUnique = true;
          scope.selectedEntity.sequencePatternTooltipMessage = null;

          scope.state.courses.ids.forEach(function(courseId) {
            var c = scope.state.courses.list[courseId];
            let cDescription = c.subjectCode + "-" + c.courseNumber + "-" + c.sequencePattern;

            if (courseDescription == cDescription) {
              scope.state.sectionGroups.ids.forEach(function(sectionGroupId) {
                var sg = scope.state.sectionGroups.list[sectionGroupId];
                if (sg.courseId == c.id && sg.termCode == sectionGroup.termCode){
                  scope.selectedEntity.sequencePatternTooltipMessage = "Sequence pattern already in use.";
                  isUnique = false;
                }
              });
            }
          });
      }

        return isUnique;
      };
    } // end link
  };
};

export default convertSectionsModal;
