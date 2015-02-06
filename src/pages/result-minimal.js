(function () {

/*---------------------------------
Result minimal v1.0
Affiche le résultat minimalistiquement

Dépend de
-
---------------------------------*/

angular.module('weather')
.directive('resultMinimal', function() {
  return {
    restrict: 'E',
    templateUrl: 'pages/result-minimal.html'
  };
});

})();
