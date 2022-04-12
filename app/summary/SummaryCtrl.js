/**
 * @ngdoc function
 * @name summaryApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the summaryApp
 */

 class SummaryCtrl {
  constructor ($scope, $route, $routeParams, $rootScope, $location, AuthService, SummaryActionCreators) {
    var self = this;
    this.$scope = $scope;
    this.$route = $route;
    this.$routeParams = $routeParams;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.AuthService = AuthService;
    this.SummaryActionCreators = SummaryActionCreators;

    $scope.workgroupId = this.$routeParams.workgroupId;
    $scope.year = this.$routeParams.year;
    $scope.view = {};

    var currentUser = AuthService.getCurrentUser();
    var isAdmin = currentUser.isAdmin();
    var isDeansOffice = currentUser.isDeansOffice();
    var isAcademicPlanner = currentUser.hasRole('academicPlanner', $scope.workgroupId);
    var isReviewer = currentUser.hasRole('reviewer', $scope.workgroupId);
    var isInstructor = currentUser.isInstructor($scope.workgroupId);
    var isInstructionalSupport = currentUser.hasRoles(['studentMasters', 'studentPhd', 'instructionalSupport'], $scope.workgroupId);

    $scope.hasAcademicPlannerSummaryAccess = isAcademicPlanner || isAdmin || isReviewer;
    $scope.hasInstructorSummaryAccess = isInstructor || isAdmin;
    $scope.hasInstructionalSupportSummaryAccess = isInstructionalSupport || isAdmin;
    $scope.hasDownloadSummaryAccess = isDeansOffice || isAdmin;

    var self = this;
    // Update the view mode when the url param changes
    $scope.$on('$routeUpdate', function () {
      self.$scope.view.mode = self.$location.search().mode;
    });

    $scope.setActiveMode = function (mode) {
      self.$location.search({ mode: mode });
    };

    $scope.getTermDisplayName = function (term) {
      return term.getTermDisplayName(term);
    };

    $rootScope.$on('summaryStateChanged', function (event, data) {
      data.ui.workgroupId = $scope.workgroupId;
      data.ui.year = $scope.year;
      self.$scope.view.state = data;
      self.setMode($scope, $routeParams, AuthService);
    });

    $rootScope.$on('sharedStateSet', function (event, data) {
      self.$scope.sharedState = data;
    });
  }

  /**
   * Adds a 'mode' url param (if one is not found) for the summary screen based on the user's roles (instructor, academic planner, or student)
   */
  setMode ($scope, $routeParams, AuthService) {
    if ($routeParams.mode && $routeParams.mode != "unknown") {
      // Set the active tab according to the URL
      $scope.view.mode = $routeParams.mode;
    } else {
      // Otherwise redirect to the default view
      var currentUser = AuthService.getCurrentUser();
      var isAdmin = currentUser.isAdmin();
      var isAcademicPlanner = currentUser.hasRole('academicPlanner', $scope.workgroupId);
      var isReviewer = currentUser.hasRole('reviewer', $scope.workgroupId);
      var isInstructor = currentUser.isInstructor($scope.workgroupId);
      var isInstructionalSupport = currentUser.hasRoles(['studentMasters', 'studentPhd', 'instructionalSupport'], $scope.workgroupId);

      if (isAcademicPlanner || isReviewer || isAdmin) {
        $scope.setActiveMode("workgroup");
      }
      else if (isInstructor) {
        $scope.setActiveMode("instructor");
      }
      else if (isInstructionalSupport) {
        $scope.setActiveMode("instructionalSupport");
      } else {
        $scope.setActiveMode("unknown");
      }
    }
  }
}

SummaryCtrl.$inject = ['$scope', '$route', '$routeParams', '$rootScope', '$location', 'AuthService', 'SummaryActionCreators'];

export default SummaryCtrl;
