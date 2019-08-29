let readerUtilizationTable = function() {
  return {
    restrict: 'E',
    template: require('./readerUtilizationTable.html'),
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

export default readerUtilizationTable;
