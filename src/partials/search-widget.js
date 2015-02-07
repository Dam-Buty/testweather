(function () {

/*---------------------------------
Search widget v1.0
Fournit le champ de recherche, le bouton de géolocalisation et le bouton GO
---------------------------------*/

angular.module('weather')
.directive('searchWidget', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/search-widget.html'
  };
});

})();
