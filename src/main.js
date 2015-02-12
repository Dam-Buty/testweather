(function () {

  angular.module("weather", [])
  .controller("WeatherController",
  [ "$window", "$scope", "$http", "$timeout", "$q",
  function($window, $scope, $http, $timeout, $q) {
    $scope.loading = false;
    $scope.page = "form";

    $scope.city = "London,UK";
    $scope.lat = undefined;
    $scope.lon = undefined;

    $scope.current = {
      temp: undefined,
      wind: undefined,
      descr: undefined,
      state: undefined,
      day: undefined,
      hourlies: [],
      temps: []
    };

    $scope.details = {
      hovering: false,
      data: {
        time: undefined,
        temp: undefined,
        icon: undefined,
        descr: undefined
      },

      set: function(i) {
        if (i !== undefined) {
          var current = $scope.current.hourlies[i];
          var date = new Date(current.dt * 1000);

          this.hovering = true;
          this.data.temp = current.main.temp;
          this.data.icon = "http://openweathermap.org/img/w/" + current.weather[0].icon + ".png";
          this.data.descr = current.weather[0].description;
          this.data.time = ("00" + date.getHours()).slice(-2) + ":" +
                           ("00" + date.getMinutes()).slice(-2);
        } else {
          this.hovering = false;
          this.data.time = undefined;
          this.data.temp = undefined;
          this.data.icon = undefined;
          this.data.descr = undefined;
        }
      }
    };

    $scope.forecast = [];

    $scope.mobile = false;
    // Détection de mobile façon homme des cavernes
    if (screen.width < 1024) {
      $scope.mobile = true;
    }

    $scope.api = {
      mock: false, // Mettre à true pour tester avec les données en local

      data: {
        current: undefined,
        hourly: undefined,
        daily: undefined
      },

      params: {
        lang: "fr",
        mode: "json",
        units: "metric",
        q: "",
        lat: "",
        lon: ""
      },

      url: {
        current: {
          base: "http://api.openweathermap.org/data/2.5/weather",
          mock: "test/current.dev.json"
        },
        hourly: {
          base: "http://api.openweathermap.org/data/2.5/forecast",
          mock: "test/forecast.min.json"
        },
        daily: {
          base: "http://api.openweathermap.org/data/2.5/forecast/daily",
          mock: "test/daily.min.json"
        }
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
        var current, hourly, daily;
        var self = this;

        if (this.mock) {
          current = this.url.current.mock;
          hourly = this.url.hourly.mock;
          daily = this.url.daily.mock;
        } else {
          current = this.url.current.base;
          hourly = this.url.hourly.base;
          daily = this.url.daily.base;
        }

        if (this.params.lat === "" && this.params.lon === "") {
          this.params.q = $scope.city;
        }

        return $q.all([
          $http.get(current, {
            params: this.getParams()
          }).success(function(data) {
            self.data.current = data;
          }),
          $http.get(hourly, {
            params: this.getParams()
          }).success(function(data) {
            self.data.hourly = data;
          }),
          $http.get(daily, {
            params: this.getParams()
          }).success(function(data) {
            self.data.daily = data;
          })
        ]).then(function() {
          self.params.q = "";
          self.params.lat = "";
          self.params.lon = "";
        });
      }
    };

    $scope.go = function() {
      $scope.loading = true;
      $scope.api.call()
      .then(function() {
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

      $scope.city = $scope.api.data.daily.city.name + "," + $scope.api.data.daily.city.country;

      window.location.hash = $scope.city;

      // On récupère la date
      var today = new Date();


      $scope.current.day = {
        human: ("00" + today.getDate()).slice(-2) + "/" +
              ("00" + (today.getMonth() + 1)).slice(-2) + "/" +
              today.getFullYear(),
        jour: dayNames[today.getDay()]
      };

      // On récupère le temps actuel dans le flux "current"
      $scope.current.temp = $scope.api.data.current.main.temp;
      $scope.current.wind = $scope.api.data.current.wind;
      $scope.current.descr = $scope.api.data.current.weather[0].description;

      // On simplifie l'état
      switch($scope.api.data.current.weather[0].main) {
        case "Snow":
          $scope.current.state = "snow";
          break;
        case "Rain":
          $scope.current.state = "rain";
          break;
        default:
          $scope.current.state = "clear";
          break;
      }

      $scope.current.hourlies = $scope.api.data.hourly.list.slice(0, 4);

      $scope.current.temps = [
        $scope.current.hourlies[0].main.temp,
        $scope.current.hourlies[1].main.temp,
        $scope.current.hourlies[2].main.temp,
        $scope.current.hourlies[3].main.temp
      ];

      $scope.forecast = $scope.api.data.daily.list.slice(1, 6);

      // Formatage des dates
      for(var i = 0;i < $scope.forecast.length;i++) {
        var day = $scope.forecast[i];

        day["dtObject"] = new Date(day.dt * 1000);
        day["dtHuman"] = ("00" + day.dtObject.getDate()).slice(-2) + "/" +
                        ("00" + (day.dtObject.getMonth() + 1)).slice(-2) + "/" +
                        day.dtObject.getFullYear();
        day["dtJour"] = dayNames[day.dtObject.getDay()];
      }

      $scope.page = "full";

      $scope.loading = false;

      // $scope.$broadcast("retrace", $scope.today.temp);
    };

    if (window.location.hash !== "") {
      $scope.city = window.location.hash.split("#")[1];
      $scope.go();
    }

    $scope.$on("graph.hover", function(e, idx) {
      $scope.details.set(idx);
    });
  }]);
})();
