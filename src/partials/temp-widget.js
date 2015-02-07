(function () {

/*---------------------------------
Temp widget v1.0
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
@ dash : la taille du dasharray du graphe (cf temp-graph.svg)
---------------------------------*/

angular.module('weather').directive('tempWidget', function() {
  return {
    restrict: 'E',
    scope: {
      temp: '=',
      descr: "=",
      mini: "=",
      dash: "="
    },
    templateUrl: 'partials/temp-widget.html'
  };
});
})();
