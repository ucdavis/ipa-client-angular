let commentModal = function () {
  return {
    restrict: 'E',
    template: require('./courseCommentModal.html'),
    replace: true,
    scope: {
      state: '<',
      course: '<'
    },
  };
};

export default commentModal;
