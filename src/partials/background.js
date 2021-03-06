(function () {

/*---------------------------------
Background v1.0
Fournit le sélecteur de background (photo ou vidéo selon le mode)
---------------------------------*/

angular.module('weather')
.directive('background', function() {
  return {
    restrict: 'E',
    scope: {
      state: "="
    },
    templateUrl: 'partials/background.html',
    controller: function($scope) {
      $scope.mode = "photo";

      if (screen.width <= 1024) {
        $scope.mobile = true;
      } else {
        $scope.mobile = false;
      }

      $scope.setMode = function(mode) {
        $scope.mode = mode;
      };
    }
  };
});

})();
