(function () {

/*---------------------------------
Temp graph v1.0
Affiche un graphe des différentes températures de la journée
Ne s'affiche pas sur mobile

Attributs
@ points : un tableau contenant 4 températures en degrés
@ mini : si true, affiche la version réduite du graphe, sinon la version complète
@ interactive : si true, affiche la version interactive du graphe, avec les points qui réagissent au hover
---------------------------------*/

angular.module('weather')
.directive('tempGraph', function() {
  return {
    restrict: 'E',
    type: 'svg',
    templateNamespace: "svg",
    scope: {
      temps: '=',
      mini: "=",
      interactive: "="
    },
    templateUrl: 'partials/temp-graph.svg',
    controller: function($scope) {
      if (screen.width < 1024) {
        $scope.mobile = true;
      } else {
        $scope.mobile = false;
        $scope.points = [];
        $scope.path = "";
        $scope.traced = false;

        $scope.trace = function(temps) {
          var min = 0, max = 0;
          $scope.temps = temps;

          for(var i = 0;i < $scope.temps.length;i++){
            min = Math.min(min, $scope.temps[i]);
            max = Math.max(max, $scope.temps[i]);
          }

          var ecart = max - min;

          var width, height, margin, step, pointsWidth;

          // Définit la grille
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
          $scope.points = [
            [step * 0 + margin , (max - Math.floor(($scope.temps[0] - min) / ecart * amplitude))],
            [step * 1 , (max - Math.floor(($scope.temps[1] - min) / ecart * amplitude))],
            [step * 2 , (max - Math.floor(($scope.temps[2] - min) / ecart * amplitude))],
            [step * 3 - margin , (max - Math.floor(($scope.temps[3] - min) / ecart * amplitude))]
          ];

          // Ici on construit le path pour l'élément SVG qui dessine le graphe
          var pathPoints = $scope.points.slice();
          var depart = pathPoints.shift(); // On récupère le point de départ

          // La commande M bouge le curseur aux coordonées de départ
          // La commande C crée une courbe passant par le reste des points
          var suffix, prefix;

          if ($scope.interactive) {
            suffix = "";
            prefix = "L";
          } else {
            suffix = "C";
            prefix = "";
          }

          var path = "M" + depart.join(",") + " " + suffix;

          for (i = 0;i < pathPoints.length;i++) {
            path += " " + prefix + pathPoints[i].join(",");
          }

          $scope.path = path;

          $scope.traced = true;
        };

        $scope.$on("retrace", function(e, temps) {
          $scope.trace(temps);
        });

        $scope.mouseover = function(idx) {
          $scope.$emit("graph.hover", idx);
        };

        $scope.mouseleave = function() {
          $scope.$emit("graph.hover", undefined);
        };

        $scope.trace($scope.temps);
      }
    },
    link: function($scope, el, attr) {
      document.getElementById("test-path").setAttribute("d", $scope.path);
      $scope.dash = Math.ceil(document.getElementById("test-path").getTotalLength());
    }
  };
});

})();
