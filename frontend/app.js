var myapp = angular.module('myapp', []);

myapp.controller('EventListController', ['$scope', function($scope){
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
    ];
}]);

