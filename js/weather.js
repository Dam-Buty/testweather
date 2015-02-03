(function () {

  angular.module("weather", [])
  .config(function($logProvider){
    $logProvider.debugEnabled(true);
  })
  .controller("WeatherController",
  [ "$window", "$scope", "$http", "$timeout",
  function($window, $scope, $http, $timeout) {
    $scope.page = "form";

    $scope.city = "Bordeaux";
    $scope.lat = undefined;
    $scope.lon = undefined;

    $scope.today = undefined;
    $scope.forecast = [];

    $scope.minimal = {
      message: "",
      features: [],
      prediction: ""
    };

    $scope.api = {
      mock: false,
      baseUrl: "http://api.openweathermap.org/data/2.5/forecast/daily",
      mockUrl: "test/data.dev.json",

      data: undefined,

      params: {
        lang: "fr",
        cnt: 6,
        mode: "json",
        units: "metric",
        q: "",
        lat: "",
        lon: ""
      },

      // Si on laisse lat et lon à vide, et que la ville n'est pas trouvée,
      // l'API renvoie le point [0°,0°] au lieu d'un code 404.
      // getParams sert à renvoyer l'objet params sans les paramètres vides/undefined
      getParams: function() {
        var filtered = {};

        for(var param in this.params) {
          if (this.params.hasOwnProperty(param)) {
            var value = this.params[param];
            if (value != "" && value !== undefined) {
              filtered[param] = value;
            }
          }
        }

        return filtered;
      },

      call: function() {
        var url;
        var self = this;

        if (this.mock) {
          url = this.mockUrl;
        } else {
          url = this.baseUrl;
        }

        if ($scope.city !== undefined) {
          this.params.q = $scope.city;
        }

        return $http.get(url, {
          params: this.getParams()
        }).success(function(data) {
          self.data = data;
        });
      }
    };

    $scope.go = function() {
      $scope.api.call()
      .success(function(data) {
        $scope.process();

        $scope.page = "full";
        // $scope.page = "minimal";
      });
    };


    // {
    //   "dt": 1423051200,
    //   "deg": 1,
    //   "humidity": 99,
    //   "temp": {
    //     "max": 278.28,
    //     "day": 276.56,
    //     "night": 275.12,
    //     "min": 271.77,
    //     "morn": 271.77,
    //     "eve": 277.3
    //   },
    //   "speed": 6.87,
    //   "clouds": 8,
    //   "pressure": 1020.12,
    //   "weather": [
    //   {
    //     "icon": "02d",
    //     "main": "Clear",
    //     "id": 800,
    //     "description": "ensoleillé"
    //   }
    //   ]
    // }

    $scope.process = function() {
      var days = $scope.api.data.list;

      $scope.city = $scope.api.data.city.name + "," + $scope.api.data.city.country;

      // Formatage des dates
      for(var i = 0;i < days.length;i++) {
        var day = days[i];

        day["dtObject"] = new Date(day.dt * 1000);
        day["dtHuman"] = ("00" + day.dtObject.getDate()).slice(-2) + "/" +
                        ("00" + (day.dtObject.getMonth() + 1)).slice(-2) + "/" +
                        day.dtObject.getFullYear();
      }

      // on duplique l'array avec slice pour garder l'original intact dans $scope.api
      days = $scope.api.data.list.slice();

      $scope.today = days.shift(); // On met le premier jour dans today
      $scope.forecast = days;      // et le reste dans forecast

      // On extrait les caractéristiques du temps d'aujourd'hui
      if ($scope.today.rain !== undefined) {
        $scope.minimal.features.push("il pleut");
      }

      if ($scope.today.snow !== undefined) {
        $scope.minimal.features.push("il neige");
      }

      if ($scope.today.temp.day < 15) {
        $scope.minimal.features.push("on se pèle");
      }

      if ($scope.today.temp.day > 30) {
        $scope.minimal.features.push("on est en plein cagnard");
      }

      if ($scope.today.humidity > 85) {
        $scope.minimal.features.push("il fait humide");
      }

      // On naturalise un peu le langage
      var firstFeature = $scope.minimal.features[0];
      var lastFeature = $scope.minimal.features[$scope.minimal.features.length - 1];

      // Finalement, est-ce qu'il fait beau ou pas?
      if ($scope.today.weather[0].main === "Clear") {
        $scope.minimal.message = "OUI";
        $scope.minimal.features[0] = "Mais " + firstFeature;
      } else {
        $scope.minimal.message = "NON";
        $scope.minimal.features[0] = "En plus " + firstFeature;
      }

      $scope.minimal.features[$scope.minimal.features.length - 1] = "et " + lastFeature + ".";
    };
  }])
  .directive('windWidget', function() {
    return {
      restrict: 'E',
      scope: {
        deg: '=',
        speed: '='
      },
      templateUrl: 'views/wind-widget.html'
    };
  })
  .directive('tempWidget', function() {
    return {
      restrict: 'E',
      scope: {
        temp: '='
      },
      templateUrl: 'views/temp-widget.html'
    };
  })
  .directive('tempGraph', function() {
    return {
      restrict: 'E',
      type: 'svg',
      templateNamespace: "svg",
      scope: {
        temp: '='
      },
      templateUrl: 'views/temp-graph.svg',
      controller: function($scope) {
        var temp = $scope.temp;
        var ecart = temp.max - temp.min;

        // On calcule les coordonées des 4 points du graphe
        var points = [
          "0," + (45 - Math.floor((temp.morn - temp.min) / ecart * 40)),
          "200," + (45 - Math.floor((temp.day - temp.min) / ecart * 40)),
          "400," + (45 - Math.floor((temp.eve - temp.min) / ecart * 40)),
          "600," + (45 - Math.floor((temp.night - temp.min) / ecart * 40))
        ];

        // Ici on construit le path pour l'élément SVG qui dessine le graphe
        // On positionne le curseur au point de départ et on crée une courbe vers les 3 autres points
        var depart = points.shift();
        $scope.path = "M " + depart + " C " + points.join(" ");
      }
    };
  })
  .directive('forecastWidget', function() {
    return {
      restrict: 'E',
      templateUrl: 'views/forecast-widget.html',
      controller: function($scope) {
        $scope.icon = "http://openweathermap.org/img/w/" + $scope.day.weather[0].icon + ".png";
      }
    };
  })
})();
