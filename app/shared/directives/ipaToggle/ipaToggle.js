let ipaToggle = function () {
  return {
    restrict: 'E',
    template: require('./ipaToggle.html'),
    replace: true,
    scope: {
      isActive: '<',
      onClick: '&?',
      inactiveText: '<?', // Will override text, displays when toggle is inactive
      activeText: '<?', // Will override text, displays when toggle is active
      text: '<?', // Text to display on the button
      activeConfirmMessage: '<?',
      inactiveConfirmMessage: '<?',
      yes: '<?',
      no: '<?',
      confirmClass: '<?'
    },
    link: function () {
      // Intentionally empty
    }
  };
};

export default ipaToggle;
