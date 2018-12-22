import './assignTagTooltip.css';

let assignTagTooltip = function () {
  return {
    restrict: 'E', // Use this via an element selector <ipa-modal></ipa-modal>
    template: require('./assignTagTooltip.html'),
    replace: true, // Replace with the template below
    scope: {
      isVisible: '='
    },
    link: function() {
      // Empty intentionally
    }
  };
};

export default assignTagTooltip;
