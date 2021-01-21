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
        var newSection = {
          seats: 270,
          sequenceNumber: "A01"
        };
        console.log(newSection);
        debugger;
        CourseActionCreators.convertCourseOffering(scope.workgroupId, scope.year, scope.selectedEntity, newSection);
        scope.isVisible = false;
      };

      scope.close = function() {
        scope.isVisible = false;
      };
    } // end link
  };
};

export default convertSectionsModal;
