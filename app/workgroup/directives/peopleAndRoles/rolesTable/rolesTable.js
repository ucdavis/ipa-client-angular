import "./rolesTable.css";

let rolesTable = function(
  $rootScope,
  WorkgroupActionCreators,
  WorkgroupService
) {
  return {
    restrict: "E",
    template: require("./rolesTable.html"),
    replace: true,
    scope: {
      userRoles: "<",
      activeRoleId: "<",
      users: "<",
      ui: "<"
    },
    link: function(scope) {
      scope.view = {
        loadingPeople: false,
        noResults: false,
        placeholder: {
          show: false,
          first: "",
          last: "",
          email: "",
          validationMessage: ""
        }
      };

      scope.removeUserRole = function(userRole) {
        WorkgroupActionCreators.removeRoleFromUser(
          userRole.userId,
          userRole.roleId,
          userRole
        );
      };

      scope.openPlaceholderUI = function() {
        scope.view.placeholder.show = true;
      };

      scope.closePlaceholderUI = function() {
        scope.view.placeholder.show = false;
        scope.view.placeholder.first = "";
        scope.view.placeholder.last = "";
        scope.view.placeholder.email = "";
      };

      scope.isPlaceholderUserValid = function() {
        if (!scope.view.placeholder.show) {
          scope.view.placeholder.validationMessage = "";
          return false;
        }

        if (
          !scope.view.placeholder.first &&
          !scope.view.placeholder.last &&
          !scope.view.placeholder.email
        ) {
          scope.view.placeholder.validationMessage = "";
          return false;
        }

        if (!scope.view.placeholder.first) {
          scope.view.placeholder.validationMessage = "First name is required";
          return false;
        }

        if (!scope.view.placeholder.last) {
          scope.view.placeholder.validationMessage = "Last name is required";
          return false;
        }

        if (!scope.view.placeholder.email) {
          scope.view.placeholder.validationMessage = "Email is required";
          return false;
        }

        scope.view.placeholder.validationMessage = "";
        return true;
      };

      scope.clearUserSearch = function() {
        scope.users.newUser = {};
        scope.users.searchQuery = "";
        scope.view.noResults = false;
      };

      scope.searchOnChange = function() {
        scope.view.noResults = false;
        scope.users.newUser = {};
      };

      scope.searchUsers = function(query) {
        return WorkgroupService.searchUsers(scope.ui.workgroupId, query).then(
          function(userSearchResults) {
            return userSearchResults;
          },
          function() {
            $rootScope.$emit("toast", {
              message: "Could not search users.",
              type: "ERROR"
            });
          }
        );
      };

      scope.searchUsersResultSelected = function($item) {
        scope.users.newUser = $item;
      };

      scope.addUserToWorkgroup = function() {
        scope.users.newUser;
        WorkgroupActionCreators.createUser(
          scope.ui.workgroupId,
          scope.users.newUser,
          scope.activeRoleId
        );
        scope.clearUserSearch();
      };
    }
  };
};

export default rolesTable;
