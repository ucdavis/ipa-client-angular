import './assignTagTooltip.css';

let assignTagTooltip = function ($rootScope) {
  return {
    restrict: 'E', // Use this via an element selector <ipa-modal></ipa-modal>
    template: require('./assignTagTooltip.html'),
    replace: true, // Replace with the template below
    scope: {
      isVisible: '='
    },
    link: function(scope, element, attrs) {
      // Empty intentionally
    }
  };
};

export default assignTagTooltip;
