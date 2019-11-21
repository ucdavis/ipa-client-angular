import './workgroupCoursesTable.css';

let workgroupCoursesTable = function () {
  return {
    restrict: 'E',
    template: require('./workgroupCoursesTable.html'),
    replace: true,
    scope: {
      workgroupCoursesList: '<',
    },
    link: function () {
      // Intentionally blank
    }
  };
};

export default workgroupCoursesTable;
