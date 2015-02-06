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
    templateUrl: 'views/temp-graph.svg',
    controller: function($scope) {
      var temp = $scope.temp;
      var ecart = temp.max - temp.min;

      var width, height, margin, step;

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
      var points = [
        step * 0 + "," + (max - Math.floor((temp.morn - temp.min) / ecart * amplitude)),
        step * 1 + "," + (max - Math.floor((temp.day - temp.min) / ecart * amplitude)),
        step * 2 + "," + (max - Math.floor((temp.eve - temp.min) / ecart * amplitude)),
        step * 3 + "," + (max - Math.floor((temp.night - temp.min) / ecart * amplitude))
      ];

      // Ici on construit le path pour l'élément SVG qui dessine le graphe
      var depart = points.shift(); // On récupère le point de départ

      $scope.path = "M " + depart +             // La commande M bouge le curseur aux coordonées de départ
                    " C " + points.join(" ");   // La commande C crée une courbe passant par le reste des points
    }
  };
});

})();
