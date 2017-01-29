// Define the `EventgoAppController` controller on the `eventgoApp` module

angular
    .module('eventgoApp')
    .component('eventFinder', {
        templateUrl: 'eventFinderViewTemplate.html',
        controller: function EventgoAppController() {
            this.evnts = [
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
        }
});