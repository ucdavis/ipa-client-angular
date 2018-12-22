import './sectionGroupList.css';

let sectionGroupList = function (InstructorFormActions) {
  return {
    restrict: 'E',
    template: require('./sectionGroupList.html'),
    replace: true,
    scope: {
      activeSectionGroupId: '<',
      allTabs: '<'
    },
    link: function (scope) {
    scope.selectSectionGroup = function(sectionGroup) {
      InstructorFormActions.selectSectionGroup(sectionGroup);
    };
    }
  };
};

export default sectionGroupList;
