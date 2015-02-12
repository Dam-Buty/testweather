(function () {

/*---------------------------------
Current card v1.0
La carte centrale qui affiche le temps qu'il fait

Dépend de :
- temp-graph
---------------------------------*/

angular.module('weather')
.directive('currentCard', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/current-card.html'
  };
});

})();
