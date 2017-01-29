var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://eventgo:asdf12345@best-ever.org:3306/eventgo');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const uuidV4 = require('uuid/v4');

app.use(cookieParser())
app.use(bodyParser.json());
app.use(express.static('public'))

var Evnt = sequelize.define('event', {
	name: {
		type: Sequelize.STRING
	},
	longitude: {
		type: Sequelize.DECIMAL(9, 6)
	},
	latitude: {
		type: Sequelize.DECIMAL(9, 6)
	},
	start: {
		type: Sequelize.DATE
	},
	end: {
		type: Sequelize.DATE
	}
});

sequelize.sync();

app.post('/get_loc', function(req, res) {
	if (req.cookies['userid'] == undefined) {
		res.cookie('userid', uuidV4());
	}
	console.log(req.cookies['userid']);
	res.json({});
	// updateEventCounts(req.cookie, req.body.position.longitude, req.body.position.latitude);
});

var userToEventToCount = {};
var userToEventDeque = {};

function getDistanceFromLatLonInM(lat1,lon1,lat2,lon2) {
  var R = 6371000; // Radius of the earth in m
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function getClosestEvent(longitude, latitude) {
	var closest = Number.MAX_VALUE;
	var closestEvent = null;
	Evnt.findAll().then(function(events) {
		for(var currEvent in events) {
			var distance = getDistanceFromLatLonInM(latitude, longitude, currEvent.latitude, currEvent.longitude);
			if(distance < 25 && distance < closest) {
				closest = distance;
				closestEvent = currEvent;
			}
		}
	});
	return closestEvent;
};

/*

function updateEventCounts(cookie, longitude, latitude) {
	var closestEvent = getClosestEvent(longitude, latitude);
	var millisSinceEpoch = Date.now();

	if(!(cookie in userToEventToCount)) {
		userToEventToCount[cookie] = {};
		userToEventDeque = [];
	}

	var eventToCount = userToEventToCount[cookie];
	var eventDeque = userToEventDeque[cookie];

	if(userToEventDeque.length < 20) {
		userToEventDeque.push(closestEvent);
		if(closestEvent) {
			if(!(closestEvent in eventToCount)) {
				eventToCount = {};
			}
			if(eventToCount[closestEvent] == 10) {
				/ / / / / / /  / / / / / / / /  / / / / add to events counter in database
			}
			eventToCount[closestEvent]++;
		}

	} else {



	}

};

*/


app.get('/events/get/all', function(req, res) {
	Evnt.findAll().then(function(events) {
		res.json(events);
	});
});

app.get('/events/get/:id', function(req, res) {
	Evnt.findById(req.params.id).then(function(events) {
		res.json(events);
	});
});

app.post('/events/add', function(req, res) {
	Evnt.create(req.body).then(function(events) {
		res.json(events);
	});
});

app.get('/helloWorld', function (req, res) {
	res.send('Hello World!')
})

app.get('/',function(req,res){
    res.sendFile(__dirname + '/frontend/index.html');
});

app.listen(3000, function () {
  console.log('EventGo started on http://localhost:3000')
})
