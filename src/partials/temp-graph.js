(function () {

/*---------------------------------
Temp graph v1.0
Affiche un graphe des différentes températures de la journée

Attributs
@ temp : un objet contenant les températures en degrés
  @ min
  @ max
  @ morn
  @ day
  @ eve
  @ night
@ mini : si true, affiche la version réduite du graphe, sinon la version complète
@ dash : la taille du dasharray du graphe. (cf temp-graph.svg)
---------------------------------*/

angular.module('weather')
.directive('tempGraph', function() {
  return {
    restrict: 'E',
    type: 'svg',
    templateNamespace: "svg",
    scope: {
      temp: '=',
      mini: "=",
      dash: "="
    },
    templateUrl: 'partials/temp-graph.svg',
    controller: function($scope) {
      var temp = $scope.temp;
      var ecart = temp.max - temp.min;

      var width, height, margin, step, pointsWidth;

      // Définit la grille selon la valeur de l'attribut mini
      if ($scope.mini) {
        width = 80;
        height = 16;
        margin = 3;
      } else {
        width = 600;
        height = 50;
        margin = 5;
      }

      step = Math.floor(width / 3); // distance horizontale entre les points du graphe
      max = height - margin;
      amplitude = max - margin;

      // On calcule les coordonées des 4 points du graphe
      $scope.pointsWidth = 3;

      $scope.points = [
        [step * 0 + margin , (max - Math.floor((temp.morn - temp.min) / ecart * amplitude))],
        [step * 1 , (max - Math.floor((temp.day - temp.min) / ecart * amplitude))],
        [step * 2 , (max - Math.floor((temp.eve - temp.min) / ecart * amplitude))],
        [step * 3 - margin , (max - Math.floor((temp.night - temp.min) / ecart * amplitude))]
      ];

      // Ici on construit le path pour l'élément SVG qui dessine le graphe

      var pathPoints = $scope.points.slice();
      var depart = pathPoints.shift(); // On récupère le point de départ

      // La commande M bouge le curseur aux coordonées de départ
      // La commande C crée une courbe passant par le reste des points
      $scope.path = "M " + depart.join(",") + " C";

      for (var i = 0;i < pathPoints.length;i++) {
        $scope.path += " " + pathPoints[i].join(",");
      }
    }
  };
});

})();
