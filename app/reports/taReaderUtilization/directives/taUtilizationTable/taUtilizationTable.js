let taUtilizationTable = function() {
  return {
    restrict: 'E',
    template: require('./taUtilizationTable.html'),
    replace: true,
    scope: {
      sectionGroups: '<',
      fetchComplete: '<',
      showTable: '<'
    },
    link: function(scope) {
      debugger;
      // Blank
    }
  };
};

export default taUtilizationTable;
