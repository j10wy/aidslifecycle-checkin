//Include directly after AngularJS and app dependencies

var onlineCheckin = angular.module('onlineCheckin', ["ui.bootstrap", "ngRoute","ngCookies"]);

onlineCheckin.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "views/login.html",
            controller: "loginCtrl"
        })
        .when("/login", {
            templateUrl: "views/login.html",
            controller: "loginCtrl"
        })
        .when("/search", {
            templateUrl: "views/participant-search.html",
            controller: "participantSearch"
        })
        .when("/rsvp", {
            templateUrl: "views/rsvp-search.html",
            controller: "rsvpSearch"
        })        
        .when("/guest", {
            templateUrl: "views/guest-info.html",
            controller: "guestInformation"
        })
        .otherwise({
            templateUrl: "views/404.html"
        });

});

onlineCheckin.run(function($rootScope, $http, $log) {

    $rootScope.sso_auth_token = "";

    $rootScope.loggedIn = false;
    $rootScope.logInError = false;

    $rootScope.teamRaiserData = {}

    $rootScope.badgeInformation = {};

    $http({
        method: 'GET',
        url: "js/participants.json"
    }).then(function(responseData) {
        //success
        $rootScope.teamRaiserData = angular.copy(responseData);
        
    }, function(responseData) {
        //error
        $rootScope.teamRaiserData = {};
    });

});
