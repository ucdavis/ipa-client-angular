import './backToTop.css';

let backToTop = function($window) {
  return {
    restrict: 'E',
    template: require('./backToTop.html'),
    replace: true,
    scope: {},
    link: function(scope, element) {
      $window.onscroll = function() {
        if (this.pageYOffset > this.innerHeight) {
          element.removeClass('backToTop__button--hidden');
        } else {
          element.addClass('backToTop__button--hidden');
        }
      };
    }
  };
};

export default backToTop;
