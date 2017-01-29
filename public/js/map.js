var map;
var infowindow;
var position;

/**
 * Returns html for infowindow.
 */
function getInfoHTML(evnt) {
	return '<link rel="stylesheet" type="text/css" href="style/infostyle.css"><h1>' +
		evnt.title + '</h1><h2>' + evnt.start +
		' - ' + evnt.end + '</h2><h3>' + evnt.description +
		'</h3>';}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
  			center: {lat: 45.503751, lng: -73.577641},
  			zoom: 16,
			/*styles: [
				{elementType: 'geometry', stylers: [{color: '#242f3e'}]},
				{elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
				{elementType: 'labels.text.fill', stylers: [{color: '#746855'}]}
				{elementType: 'road', elementType: 'geometry', stylers[{color: '#}]]*/
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {

		var position = new google.maps.LatLng(
					position.coords.latitude,
					position.coords.longitude);

		map.setCenter(position);

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

	for(var i = 0, evnt; evnt = test_data[i]; i++){
		addMarker(evnt);
	}

}

/**
 * Creates marker and infowindow listener.
 */
function addMarker(evnt){
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(evnt.lat, evnt.lng),
		icon: 'images/map_icon.png',
		map: map,
		title: evnt.name
	});
	marker.addListener('click', function() {
		infowindow.setContent(getInfoHTML(evnt));
		infowindow.open(map, marker);
	});
}

/**
 * Sample data.
 */
var test_data = [{title: 'FireGrill', lat:45.499920, lng: -73.575291,
			start: '10:00pm', end: '2:00am', description: 'Wild and crazy times!'},
				 {title: '3 Brasseurs', lat: 45.502004, lng: -73.570698,
			start: '5:00pm', end: '11:00pm', description: 'Beer, beer, beer!'}];

/**
 * To be called when user does not have geolocation.
 */
function handleLocationError(browserHasGeo, infoWindow, pos){
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeo ?
							'Error: Geolocation service failed.' :
							'Error: browser doesn\'t support geolocation.');
}

/**
 * Post users location.
 */
function postLocation(){
	$.post("get_loc", position, function(data){
		console.log(data);
	});
}

/**
 * User location post.
 */
var postInterval = setInterval(postLocation, 1000 * 10);

