(function () {

/*---------------------------------
Result full v1.0
Affiche le résultat entier & les forecasts

Dépend de
- background
- wind-widget
- search-widget
- current-card
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
