(function () {

/*---------------------------------
Augmented graph v1.0
Affiche un graphe des différentes températures de la journée qui gère le hover
---------------------------------*/

angular.module('weather')
.directive('augmentedGraph', function() {
  return {
    restrict: 'E',
    type: 'svg',
    scope: {
      hourlies: '=',
    },
    templateNamespace: "svg",
    templateUrl: 'partials/augmented-graph.svg',
    controller: function($scope) {
      $scope.dash = 604;
      $scope.points = [];
      $scope.pointsWidth = 3;
      $scope.path = "";

      $scope.trace = function() {
        var min = 0, max = 0;

        for(var i = 0;i < $scope.hourlies.length;i++){
          min = Math.min(min, $scope.hourlies[i].main.temp);
          max = Math.max(max, $scope.hourlies[i].main.temp);
        }

        var ecart = max - min;

        var width, height, margin, step, pointsWidth;

        // Définit la grille
        width = 600;
        height = 50;
        margin = 5;

        step = Math.floor(width / 3); // distance horizontale entre les points du graphe
        max = height - margin;
        amplitude = max - margin;

        // On calcule les coordonées des 4 points du graphe
        $scope.points = [
          [step * 0 + margin , (max - Math.floor(($scope.hourlies[0].main.temp - min) / ecart * amplitude))],
          [step * 1 , (max - Math.floor(($scope.hourlies[1].main.temp - min) / ecart * amplitude))],
          [step * 2 , (max - Math.floor(($scope.hourlies[2].main.temp - min) / ecart * amplitude))],
          [step * 3 - margin , (max - Math.floor(($scope.hourlies[3].main.temp - min) / ecart * amplitude))]
        ];

        // Ici on construit le path pour l'élément SVG qui dessine le graphe
        var pathPoints = $scope.points.slice();
        var depart = pathPoints.shift(); // On récupère le point de départ

        // La commande M bouge le curseur aux coordonées de départ
        // La commande C crée une courbe passant par le reste des points
        $scope.path = "M " + depart.join(",");

        for (i = 0;i < pathPoints.length;i++) {
          $scope.path += " L " + pathPoints[i].join(",");
        }
      };

      $scope.$on("retrace", function(e, temp) {
        $scope.trace();
      });

      $scope.trace();
    }
  };
});

})();
