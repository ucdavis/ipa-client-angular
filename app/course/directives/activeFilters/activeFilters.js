import './activeFilters.css';

let activeFilters = function (CourseActionCreators) {
  return {
    restrict: "E",
    template: require('./activeFilters.html'),
		replace: true,
    scope: {
      filters: '<',
      tags: '<',
      workgroupId: '<',
      year: '<'
    },
    link: function (scope) {
      scope.toggleTagFilter = function (tagId) {
        var tagFilters = scope.filters.enabledTagIds;
        var tagIndex = scope.filters.enabledTagIds.indexOf(tagId);

        if (tagIndex < 0) {
          scope.filters.enabledTagIds.push(tagId);
        } else {
          scope.filters.enabledTagIds.splice(tagIndex, 1);
        }

        CourseActionCreators.updateTagFilters(tagFilters);
      };
      scope.unpublishedCoursesToggled = function() {
        CourseActionCreators.setUnpublishedCoursesFilter(scope.workgroupId, scope.year, !scope.filters.enableUnpublishedCourses);
      };
    }
  };
};

export default activeFilters;
