(function (angular) {
    "use strict";

    angular.module(
        "weather", ["weather_config", "ui.bootstrap", "ngResource"]
    ).factory("get_location", ["$q", function ($q) {
        return function () {
            return $q(function (resolve, reject) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        resolve,
                        function
                        (e) {
                            reject(e.message);
                        }
                    );
                } else {
                    reject("Geolocation is not supported by your browser");
                }
            });
        };
    }]).factory("forecast", ["$resource", "WEATHER_CONFIG",
        function ($resource, WEATHER_CONFIG) {
            return $resource(
                "http://api.openweathermap.org/data/2.5/weather",
                {
                    APPID: WEATHER_CONFIG.APPID,
                    units: "metric"
                },
                {
                    by_coordinates: {
                        method: "GET"
                    },
                    by_query : {
                        method: "GET"
                    }
                }
            );
        }
    ]).controller("main", ["$scope", "get_location", "forecast", function (
        $scope, get_location, forecast
        ) {
            $scope.fcst_by_q = function () {
                $scope.fcst = forecast.by_coordinates({
                    q: $scope.q
                });
            };

            get_location().then(
                function (p) {
                    $scope.fcst = forecast.by_coordinates({
                        lat: p.coords.latitude,
                        lon: p.coords.longitude
                    });
                },
                function (e) {
                    $scope.no_location = true;
                }
            );
        }
    ]);
}(angular));
