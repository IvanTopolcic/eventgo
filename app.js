var myapp = angular.module('myapp', []);

myapp.controller('EventListController', ['$scope', '$http', function($scope, $http) {
    $scope.eventList = [];
    $http.get('/events/get/all').then(function(events) {
        console.log(events);
        $scope.eventList = events.data;
    }).catch(function(err) {
        console.log('err: ', err);
    });
}]);
