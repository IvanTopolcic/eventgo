var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://eventgo:asdf12345@best-ever.org:3306/eventgo');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const uuidV4 = require('uuid/v4');

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
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
	},
	population: {
		type: Sequelize.INTEGER
	}
});

sequelize.sync();

app.post('/get_loc', function(req, res) {
	//console.log(req.body);
	if (req.cookies['userid'] == undefined) {
		res.cookie('userid', uuidV4());
	}
	//console.log(req.cookies['userid']);
	updateEventCounts(function(a, b) {
		handleClosestEvent(a, b);
	}, req.cookie, req.body.lng, req.body.lat);
	res.send(req.body);
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

function updateEventCounts(fn, cookie, longitude, latitude) {
	//console.log("MYlat: " + latitude);
	//console.log("MYlon: " + longitude);
	var closest = Number.MAX_VALUE;
	var closestEvent = null;
	Evnt.findAll().then(function(events) {
		events.forEach(function(currEvent) {
			//console.log("lat: " + currEvent.latitude);
			//console.log("lon: " + currEvent.longitude);
			var distance = getDistanceFromLatLonInM(latitude, longitude, currEvent.latitude, currEvent.longitude);
			if(distance < 1000 && distance < closest) {
				//console.log(closestEvent);
				closest = distance;
				closestEvent = currEvent;
			}
		});
		console.log("addEvent: " + closestEvent);
		fn(cookie, closestEvent);
	});
	return closestEvent;
};

function handleClosestEvent(cookie, closestEvent) {
	//var closestEvent = getClosestEvent(longitude, latitude);
	//var millisSinceEpoch = Date.now();

	if(!(cookie in userToEventToCount)) {
		userToEventToCount[cookie] = {};
		userToEventDeque[cookie] = [];
	}

	var eventToCount = userToEventToCount[cookie];
	var eventDeque = userToEventDeque[cookie];

	var addEvent = closestEvent;
	var removeEvent = null;
	if(eventDeque.length == 20) {
		removeEvent = eventDeque.shift();
	}
	eventDeque.push(addEvent);

	if(addEvent && !(addEvent.id in eventToCount)) {
		eventToCount[addEvent.id] = 0;
	}
	console.log("hi");
	if(addEvent && !removeEvent) {
		if(eventToCount[addEvent.id] == 10) {
			Evnt.findById(addEvent.id).then(function(addEvnt) {
				console.log("INCCCCC");
				addEvnt.population++;
				addEvnt.save();
			});
		}
		eventToCount[addEvent.id]++;
		console.log("addEvent.id count: " + eventToCount[addEvent.id]);
	} else if(!addEvent && removeEvent) {
		if(eventToCount[removeEvent.id] == 11) {
			Evnt.findById(removeEvent.id).then(function(rmvEvnt) {
				console.log("DECCCCC");
				rmvEvnt.population--;
				rmvEvnt.save();
			});
		}
		eventToCount[removeEvent.id]--;
		console.log("removeEvent.id count: " + eventToCount[removeEvent.id]);
	} else if(addEvent && removeEvent && addEvent.id != removeEvent.id) {
		if(eventToCount[removeEvent.id] == 11) {
			Evnt.findById(removeEvent.id).then(function(rmvEvnt) {
				console.log("DECCCCC");
				rmvEvnt.population--;
				rmvEvnt.save();
			});
		}
		eventToCount[removeEvent.id]--;
		console.log("removeEvent.id count: " + eventToCount[removeEvent.id]);

		if(eventToCount[addEvent.id] == 10) {
			Evnt.findById(addEvent.id).then(function(addEvnt) {
				console.log("INCCCCC");
				addEvnt.population++;
				addEvnt.save();
			});
		}
		eventToCount[addEvent.id]++;
		console.log("addEvent.id count: " + eventToCount[addEvent.id]);
	}
	console.log("bye");

	Evnt.findById(6).then(function(events) {
		console.log("population: " + events.population);
	});
};

app.get('/events/get/all', function(req, res) {
	console.log('test');
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
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
  console.log('EventGo started on http://localhost:3000')
})
