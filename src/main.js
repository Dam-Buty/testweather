(function () {

  angular.module("weather", [])
  .controller("WeatherController",
  [ "$window", "$scope", "$http", "$timeout",
  function($window, $scope, $http, $timeout) {
    $scope.loading = false;
    $scope.page = "form";

    $scope.city = "London,UK";
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
            if (value !== "" && value !== undefined) {
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

        if (this.params.lat === "" && this.params.lon === "") {
          this.params.q = $scope.city;
        }

        return $http.get(url, {
          params: this.getParams()
        }).success(function(data) {
          self.data = data;
          self.params.q = "";
          self.params.lat = "";
          self.params.lon = "";
        });
      }
    };

    $scope.go = function() {
      $scope.loading = true;
      $scope.api.call()
      .success(function(data) {
        $scope.process();
      });
    };

    $scope.localize = function() {
      var self = this;
      $scope.loading = true;

      var remoteLocalize = function() {
        $http.get("https://freegeoip.net/json/")
        .success(function(data) {
          $scope.api.params.q = "";
          $scope.api.params.lat = data.latitude;
          $scope.api.params.lon = data.longitude;
          $scope.go();
        })
        .error(function() {
          alert("Le service de géolocalisation n'est pas disponible. Il va falloir entrer une ville à la main!");
        });
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          $scope.api.params.q = "";
          $scope.api.params.lat = position.coords.latitude;
          $scope.api.params.lon = position.coords.longitude;
          $scope.go();
        }, function() {
          remoteLocalize();
        });
      } else {
        remoteLocalize();
      }
    };

    $scope.process = function() {
      var days = $scope.api.data.list;
      var dayNames = [
        "dimanche",
        "lundi",
        "mardi",
        "mercredi",
        "jeudi",
        "vendredi",
        "samedi"
      ];

      $scope.city = $scope.api.data.city.name + "," + $scope.api.data.city.country;
      $scope.minimal.features = [];

      window.location.hash = $scope.city;

      // Formatage des dates
      for(var i = 0;i < days.length;i++) {
        var day = days[i];

        day["dtObject"] = new Date(day.dt * 1000);
        day["dtHuman"] = ("00" + day.dtObject.getDate()).slice(-2) + "/" +
                        ("00" + (day.dtObject.getMonth() + 1)).slice(-2) + "/" +
                        day.dtObject.getFullYear();
        day["dtJour"] = dayNames[day.dtObject.getDay()];
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

      if ($scope.minimal.features.length > 1) {
        $scope.minimal.features[$scope.minimal.features.length - 1] = "et " + lastFeature + ".";
      }

      // document.getElementsByTagName("video")[0].addEventListener("loadeddata", function(e) {
        // $scope.page = "full";
        $scope.page = "minimal";
        $scope.loading = false;
        // $scope.$apply();
      // });
    };

    if (window.location.hash !== "") {
      $scope.city = window.location.hash.split("#")[1];
      $scope.go();
    }
  }]);
})();
