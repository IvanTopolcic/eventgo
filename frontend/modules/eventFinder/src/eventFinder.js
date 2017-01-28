function EventFinderController() {

}

angular.module('eventgoApp').component('eventFinder', {
    templateUrl: 'eventFinderViewTemplate.html',
    controller: 'EventFinderController',
    bindings: {
        name: '=',
        location: '='
    }
});