var express = require('express')
var app = express()

app.get('/',function(req,res){
  res.sendFile('/Users/puranikk/Documents/Repos/eventgo/frontend/index.html');
});

app.listen(3000, function () {
  console.log('EventGo started on http://localhost:3000')
})
