(function () {

/*---------------------------------
Temp widget v1.1
Affiche les températures min et max ainsi que le graphe

Dépend de :
- temp-graph

Attributs
@ temp : un objet contenant les températures en degrés
  @ min
  @ max
  @ morn
  @ day
  @ eve
  @ night
@ descr : description des conditions météo ("Ensoleillé", "Nuageux"...)
@ mini : si true, affiche la version réduite du graphe, sinon la version complète
---------------------------------*/

angular.module('weather').directive('tempWidget', function() {
  return {
    restrict: 'E',
    scope: {
      temp: '=',
      descr: "=",
      mini: "="
    },
    templateUrl: 'partials/temp-widget.html',
    controller: function($scope) {
      $scope.temps = [$scope.temp.morn, $scope.temp.day, $scope.temp.eve, $scope.temp.night];
      $scope.temp.min = +($scope.temp.min).toFixed(1);
      $scope.temp.max = +($scope.temp.max).toFixed(1);
    }
  };
});
})();
