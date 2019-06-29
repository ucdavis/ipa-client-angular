import './addPlaceholderUser.css';

let addPlaceholderUser = function (WorkgroupActionCreators) {
  return {
    restrict: 'E',
    template: require('./addPlaceholderUser.html'),
    replace: true,
    scope: {
      isVisible: '='
    },
    link: function (scope) {
      scope.view = {
        firstName: "",
        lastName: "",
        email: "",
        validationMessage: ""
      };

      scope.addPlaceholderUser = function() {
        var user = {
          firstName: scope.view.firstName,
          lastName: scope.view.lastName,
          email: scope.view.email
        };

        WorkgroupActionCreators.addPlaceholderUser(user);
        scope.close();
      };

      scope.isPlaceholderUserValid = function() {
        if (
          !scope.view.firstName &&
          !scope.view.lastName &&
          !scope.view.email
        ) {
          scope.view.validationMessage = "";
          return false;
        }

        if (!scope.view.firstName) {
          scope.view.validationMessage = "First name is required";
          return false;
        }

        if (!scope.view.lastName) {
          scope.view.validationMessage = "Last name is required";
          return false;
        }

        if (!scope.view.email) {
          scope.view.validationMessage = "Email is required";
          return false;
        }

        scope.view.validationMessage = "";
        return true;
      };

      scope.close = function () {
        scope.isVisible = false;
      };
    } // end link
	};
};

export default addPlaceholderUser;
