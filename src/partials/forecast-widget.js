(function () {

/*---------------------------------
Forecast widget v1.0
Affiche un forecast

Dépend de
- temp-widget

Attributs
@
@
---------------------------------*/

angular.module('weather')
.directive('forecastWidget', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/forecast-widget.html',
    controller: function($scope) {
      $scope.icon = "http://openweathermap.org/img/w/" + $scope.day.weather[0].icon + ".png";
      $scope.hovering = false;

      $scope.mouseover = function() {
        $scope.hovering = true;
      };

      $scope.mouseleave = function() {
        $scope.hovering = false;
      };
    }
  };
});

})();
