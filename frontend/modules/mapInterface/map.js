var map;
var infowindow;

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

		var pos = new google.maps.LatLng(
					position.coords.latitude, 
					position.coords.longitude);

		map.setCenter(pos);

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
	
var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
var icons = {
	'info': {
		icon: iconBase + 'info-i_maps.png'
	}
};


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

var test_data = [{title: 'FireGrill', lat:45.499920, lng: -73.575291, 
			start: '10:00pm', end: '2:00am', description: 'Wild and crazy times!'},
				 {title: '3 Brasseurs', lat: 45.502004, lng: -73.570698, 
			start: '5:00pm', end: '11:00pm', description: 'Beer, beer, beer!'}];


function handleLocationError(browserHasGeo, infoWindow, pos){
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeo ?
							'Error: Geolocation service failed.' :
							'Error: browser doesn\'t support geolocation.');
}


