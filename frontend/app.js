'use strict';

// Define the `eventgoApp` module
var eventgoApp = angular.module('eventgoApp', []);

// Define the `EventgoAppController` controller on the `eventgoApp` module
eventgoApp.controller('EventgoAppController', function EventgoAppController($scope) {
    $scope.evnts = [
        {
            name: "McKibbins Irish Pub",
            location: "Blvd St. Laurent, Montreal"
        },
        {
            name: "Tokyo",
            location: "Blvd St. Laurent, Montreal"
        },
        {
            name: "Brutopia",
            location: "Rue Crescent, Montreal"
        }
    ]
});
