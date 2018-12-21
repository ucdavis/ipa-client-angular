import './tutorialModal.css';

let tutorialModal = function ($rootScope) {
  return {
    restrict: 'E',
    template: require('./tutorialModal.html'),
    replace: true,
    scope: {
      isVisible: '='
    },
    link: function() {
      // Empty intentionally
    }
  };
};

export default tutorialModal;
