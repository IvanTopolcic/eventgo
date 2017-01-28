var express = require('express')
var app = express()
var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://eventgo:asdf12345@best-ever.org:3306/eventgo')
var bodyParser = require('body-parser')

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

var Attendee = sequelize.define('attendee', {
	ip: {
		type: Sequelize.STRING(15)
	}
});

sequelize.sync();

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
	// Evnt.create({name: req.})
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('EventGo started on http://localhost:3000')
})
