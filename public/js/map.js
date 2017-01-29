var map;
var infowindow;
var pos;
var hasGeo = true;
var initialized = 0;
var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getMinutes(mins){
	if(mins/10 < 1){
		return '0' + mins;
	}
	return mins
}

/**
 * Returns html for infowindow.
 */
function getInfoHTML(evnt) {
	//var s = evnt.start.split(/[- :]/);
	var start = new Date(evnt.start);
	var stop = new Date(evnt.end);

	return '<h1>' +
		evnt.name + '</h1><h2>' + daysOfWeek[start.getDay()] + ' ' + (start.getHours() % 12 || 12) + ':' + getMinutes(start.getMinutes()) +
		' - ' + (stop.getHours() % 12 || 12) + ':' + getMinutes(stop.getMinutes()) + '</h2><h3>' + 			evnt.population + ' people </h3>';}

function loadMap() {
	map = new google.maps.Map(document.getElementById('map'), {
  			center: {lat: 45.503751, lng: -73.577641},
  			zoom: 16,
			styles: [
				{
					featureType: 'poi',
					elementType: 'labels',
					stylers: [
						{ 'visibility': 'off' }
					]
				}
			],
			mapTypeControl: false,
			/*styles: [
				{elementType: 'geometry', stylers: [{color: '#242f3e'}]},
				{elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
				{elementType: 'labels.text.fill', stylers: [{color: '#746855'}]}
				{elementType: 'road', elementType: 'geometry', stylers[{color: '#}]]*/
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {

		pos = new google.maps.LatLng(
					position.coords.latitude,
					position.coords.longitude);

		initialized = 1;

		var userLoc = new google.maps.Marker({
			position: pos,
			map: map,
			icon: 'images/userLoc.png',
			title: 'You'

		});
		map.setCenter(userLoc.getPosition());

	}, function() {
		handleLocationError(true, infoWindow, map.getCenter());
	});
	}
	else{
		// No browser support
		handLocationError(false, infoWindow, map.getCenter());
	}
	infowindow = new google.maps.InfoWindow({
			content: ''
	});

	// for(var i = 0, evnt; evnt = test_data[i]; i++){
	// 	addMarker(evnt);
	// }

}

/**
 * Creates marker and infowindow listener.
 */
function addMarker(evnt){
	var icon = {
		url: "/images/circle.png", // url
		scaledSize: new google.maps.Size(20, 20), // scaled size
		origin: new google.maps.Point(0,0), // origin
		anchor: new google.maps.Point(0, 0) // anchor
	}
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(evnt.latitude, evnt.longitude),
		icon: icon,
		map: map,
		title: evnt.name
	});
	marker.addListener('click', function() {
		infowindow.setContent(getInfoHTML(evnt));
		infowindow.open(map, marker);
	});

	// var marker2 = new google.maps.Marker({
	// 	position: new google.maps.LatLng(45.503751, -73.577641),
	// 	icon: icon,
	// 	map: map,
	// 	title: 'my 2nd title'
	// });
	//google.maps.event.addDomListener(document.getElementById("event-name"), "click", function(ev) {
	//	map.setCenter(marker2.getPosition());
	//});
}

/**
 * Sample data.
 */
// var test_data = [{title: 'FireGrill', lat:45.499920, lng: -73.575291,
// 			start: '10:00pm', end: '2:00am', description: 'Wild and crazy times!'},
// 				 {title: '3 Brasseurs', lat: 45.502004, lng: -73.570698,
// 			start: '5:00pm', end: '11:00pm', description: 'Beer, beer, beer!'}];

/**
 * To be called when user does not have geolocation.
 */
function handleLocationError(browserHasGeo, infoWindow, pos){
	hasGeo = false;
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeo ?
							'Error: Geolocation service failed.' :
							'Error: browser doesn\'t support geolocation.');
}

/**
 * Post users location.
 */
function postLocation(){
	console.log(navigator);
	if (hasGeo && initialized) {
		var tmp = {};
		tmp['lat'] = pos.lat();
		tmp['lng'] = pos.lng();
		$.post("get_loc", tmp, function(data){
			//console.log('yo whattup');
		});
	}
}

function loadPoints(){
	for(var j = 0, e; e = eventVar[j]; j++){
		addMarker(e);
	}
}

function getEvents() {
	$.get('/events/get/all', function(events) {
		console.log('same');
		eventVar = events;
		loadPoints();
	});
}

//google.maps.event.addDomListener(window, 'load', loadPoints);

/**
 * User location post.
 */
var postInterval = setInterval(postLocation, 2000);

var getInterval = setInterval(getEvents, 2000);
