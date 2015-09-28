'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view',
    'myApp.version'
]).config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'view/view.html',
            controller: 'ViewCtrl'
        })
        .when('/about', {
            templateUrl: 'view/about.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});
