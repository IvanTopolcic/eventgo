var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://eventgo:asdf12345@best-ever.org:3306/eventgo');
var bodyParser = require('body-parser');



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

app.post('/getLocation/', function(req, res) {
	updateEventCounts(req.cookie, req.body.position.longitude, req.body.position.latitude);
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



function updateEventCounts(cookie, longitude, latitude) {
	var closestEvent = getClosestEvent(longitude, latitude);
	var millisSinceEpoch = Date.now();

	if(!(cookie in userToEventToCount)) {
		userToEventToCount[cookie] = {};
		userToEventDeque[cookie] = [];
	}

	var eventToCount = userToEventToCount[cookie];
	var eventDeque = userToEventDeque[cookie];

	var addEvent = closestEvent;
	var removeEvent = null;
	if(userToEventDeque == 20) {
		removeEvent = eventDeque.shift();
	}
	userToEventDeque.push(addEvent);

	if(addEvent && !(addEvent.id in eventToCount)) {
		eventToCount[addEvent.id] = 0;
	}

	if(addEvent && !removeEvent) {
		eventToCount[addEvent.id]++;
	} else if(!addEvent && removeEvent) {
		eventToCount[removeEvent.id]--;
	} else if(addEvent && removeEvent && addEvent.id != removeEvent.id) {
		if(eventToCount[removeEvent.id] == 11) {
			Evnt.findById(removeEvent.id).then(function(rmvEvnt) {
				rmvEvnt.population--;
				rmvEvnt.save;
			});
		}
		eventToCount[removeEvent.id]--;
		if(eventToCount[addEvent.id] == 10) {
			Evnt.findById(addEvent.id).then(function(addEvnt) {
				addEvnt.population++;
			});
		}
		eventToCount[addEvent.id]++;
	}

};




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
