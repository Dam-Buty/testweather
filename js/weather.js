(function () {

  angular.module("weather", [])
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
      mock: true,
      baseUrl: "http://api.openweathermap.org/data/2.5/forecast/daily",
      mockUrl: "test/data.dev.json",

      params: {
        lang: "fr",
        cnt: 6,
        mode: "json",
        units: "metric",
        q: "",
        lat: "",
        lon: ""
      },

      // getParams retourne l'objet params sans les paramètres vides/undefined
      // pour avoir un vrai 404 sur une ville non trouvée, et pas le point [0°,0°]
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
          $scope.api.data = data;
        });
      },

      data: undefined
    };

    $scope.go = function() {
      $scope.api.call()
      .success(function(data) {
        $scope.process();

        $scope.page = "minimal";
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

      if ($scope.today.humidity > 85) {
        $scope.minimal.features.push("il fait humide");
      }

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

      $scope.minimal.features[$scope.minimal.features.length - 1] = "et " + lastFeature;
    }
  }]);
})();
