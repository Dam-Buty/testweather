(function () {

/*---------------------------------
Wind widget v1.0
Affiche la vitesse et l'orientation du vent

Attributs
@ deg : orientation en degrés par rapport au Nord
@ speed : vitesse en km/h
---------------------------------*/

angular.module('weather').directive('windWidget', function() {
  return {
    restrict: 'E',
    scope: {
      deg: '=',
      speed: '='
    },
    templateUrl: 'partials/wind-widget.html'
  };
});
})();
