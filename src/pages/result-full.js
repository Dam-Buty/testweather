(function () {

/*---------------------------------
Result full v1.0
Affiche le résultat entier & les forecasts

Dépend de
- wind-widget
- search-widget
- temp-widget
- forecast-widget
---------------------------------*/

angular.module('weather')
.directive('resultFull', function() {
  return {
    restrict: 'E',
    templateUrl: 'pages/result-full.html'
  };
});

})();