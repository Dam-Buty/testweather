(function () {

/*---------------------------------
Result minimal v1.0
Affiche le résultat minimalistiquement

Dépend de
-
---------------------------------*/

angular.module('weather')
.directive('resultMinimal', ["$timeout", function($timeout) {
  return {
    restrict: 'E',
    templateUrl: 'pages/result-minimal.html',
    scope: {
      minimal: '=',
      city: '='
    },
    controller: function($scope) {
      $scope.currentFeature = "";
      $scope.currentIndex = 0;
      $scope.delay = 1500;

      $scope.tick = function() {
        $timeout(function() {
          if ($scope.currentIndex < $scope.minimal.features.length) {
            $scope.currentFeature = $scope.minimal.features[$scope.currentIndex];
            $scope.currentIndex++;
            $scope.tick();
          } else {
            $scope.$parent.$parent.page = "full";
          }
        }, $scope.delay);
      };

      $scope.tick();
    }
  };
}]);

})();
