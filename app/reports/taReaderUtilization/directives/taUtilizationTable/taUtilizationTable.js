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
    link: function() {
      // Intentionally blank
    }
  };
};

export default taUtilizationTable;
