(function () {

/*---------------------------------
Front form v1.0
La page d'accueil

Dépend de
- search-widget
---------------------------------*/

angular.module('weather')
.directive('frontForm', function() {
  return {
    restrict: 'E',
    templateUrl: 'pages/front-form.html'
  };
});

})();
