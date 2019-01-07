import './noAccess.css';

let noAccess = function () {
  return {
    restrict: 'E',
    template: require('./noAccess.html'),
    replace: true,
    scope: {
      workgroupName: '<',
    },
    link: function() {
      // Intentionally blank
    }
  };
};

export default noAccess;
