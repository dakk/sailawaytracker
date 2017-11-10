'use strict';

(() => {
  angular.module('app', ['ngRoute', 'leaflet-directive'])
  .config(['$routeProvider', '$locationProvider',($routeProvider, $locationProvider) => {
    $routeProvider
    .when('/races', {
      template: '<races></races>'
    })
    .when('/race/:id', {
      template: '<race></race>'
    })
    .otherwise({
      redirectTo: '/races'
    });

    $locationProvider.html5Mode(true);
  }]);
})();
