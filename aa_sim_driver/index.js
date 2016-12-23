var socketClient = require('socket.io-client');
var readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var host = process.env.HOST || '127.0.0.1';
// var port = process.env.PORT || '8080';
var port = 8082;

var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwicG9wdWxhdGVkIjp7InBldHMiOnsidmFsdWUiOlsiNTgxN2U2OGQ2NDRiZDg5ZDQ0Y2NiMjIzIiwiNTgxNzk0ZmViYjViNjQ5MzcyODRlMTQ1IiwiNTgzMGY5OGZhZWVkZjU0NDIyY2Q3MzlmIiwiNTgzMGZhMjZhZWVkZjU0NDIyY2Q3M2EwIiwiNTgzMGZjNWJhZWVkZjU0NDIyY2Q3M2ExIiwiNTgzMGZkNDlhZWVkZjU0NDIyY2Q3M2EyIl0sIm9wdGlvbnMiOnsicGF0aCI6InBldHMiLCJzZWxlY3QiOiJiYXNpYy5uYW1lIiwiX2RvY3MiOnsiNTgyZTM3NWU4OWQ2MmExZGUwY2U4OTVlIjpbIjU4MTdlNjhkNjQ0YmQ4OWQ0NGNjYjIyMyIsIjU4MTc5NGZlYmI1YjY0OTM3Mjg0ZTE0NSIsIjU4MzBmOThmYWVlZGY1NDQyMmNkNzM5ZiIsIjU4MzBmYTI2YWVlZGY1NDQyMmNkNzNhMCIsIjU4MzBmYzViYWVlZGY1NDQyMmNkNzNhMSIsIjU4MzBmZDQ5YWVlZGY1NDQyMmNkNzNhMiJdfSwiaXNWaXJ0dWFsIjpmYWxzZX19fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicGFzc3dvcmQiOiJpbml0IiwiZW1haWwiOiJpbml0IiwicGV0cyI6ImluaXQiLCJfX3YiOiJpbml0IiwiYWN0aXZhdGVkIjoiaW5pdCIsInBob25lX25vIjoiaW5pdCIsImZpcnN0X25hbWUiOiJpbml0IiwibGFzdF9uYW1lIjoiaW5pdCIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwicGV0cyI6dHJ1ZSwiYWN0aXZhdGVkIjp0cnVlLCJwaG9uZV9ubyI6dHJ1ZSwiZmlyc3RfbmFtZSI6dHJ1ZSwibGFzdF9uYW1lIjp0cnVlLCJwYXNzd29yZCI6dHJ1ZSwiZW1haWwiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJwZXRzIjpbeyJfaWQiOiI1ODMwZmM1YmFlZWRmNTQ0MjJjZDczYTEifSx7Il9pZCI6IjU4MzBmZDQ5YWVlZGY1NDQyMmNkNzNhMiIsImJhc2ljIjp7Im5hbWUiOiJQZWtpbmcifX1dLCJfX3YiOjQsImFjdGl2YXRlZCI6ZmFsc2UsInBob25lX25vIjo2NDY4MzAyNzE3LCJmaXJzdF9uYW1lIjoieWlyYW4iLCJsYXN0X25hbWUiOiJ0YW8iLCJwYXNzd29yZCI6IiQyYSQwNSRUVkNRS1g0R3l4WjcxMzlHb2h4dTd1TUtFMEdTOGFjdjdJYWNPMjl4RXNZSDVrYkI0TURrTyIsImVtYWlsIjoieXQyNDg3QGNvbHVtYmlhLmVkdSIsIl9pZCI6IjU4MmUzNzVlODlkNjJhMWRlMGNlODk1ZSJ9LCJfcHJlcyI6eyIkX19vcmlnaW5hbF9zYXZlIjpbbnVsbCxudWxsLG51bGxdLCIkX19vcmlnaW5hbF92YWxpZGF0ZSI6W251bGxdLCIkX19vcmlnaW5hbF9yZW1vdmUiOltudWxsXX0sIl9wb3N0cyI6eyIkX19vcmlnaW5hbF9zYXZlIjpbXSwiJF9fb3JpZ2luYWxfdmFsaWRhdGUiOltdLCIkX19vcmlnaW5hbF9yZW1vdmUiOltdfSwiaWF0IjoxNDgwNTIzNDQwLCJleHAiOjE0ODMxMTU0NDB9.mSKRPQ_E015qHkW39GGENTdP6cHpISPVxMrT-dOfby8";

var nationalGallery = {lat: 51.508929, lng: -0.128299};

var ucl = {lat: 51.524559, lng: -0.13404};

var ioUser = {};
var ioDriverFlag = false;

// force to connect a new connection even if the existing sockets hasn't closed
var ioDriver = socketClient.connect("http://127.0.0.1:8082", {
											'force new connection': true
										});
 
ioDriver.on('connect', function () {
  ioDriver
    .emit('authenticate', {token: token}) //send the jwt
    .on('authenticated', function () {
      //do other things
    })
    .on('unauthorized', function(err) {
      console.log("unauthorized: " + JSON.stringify(err.data));
    })
});




var loop = "";

function randomFloat(low, high) {
	var low = 0.01;
	var high = 0.02;
	return (Math.random() * (high - low) + low);
}

function updateDriverLoc() {
	ioDriver.emit('updateDriverLoc', {latLng: [ucl.lat + randomFloat(0.1, 0.2), ucl.lng + randomFloat(0.1, 0.2)]});
}


var driverMarker = {"latLng": [ucl.lat, ucl.lng]};

function initDriver(){
	ioDriver.emit('initDriver', driverMarker);
}

var clientMarker = {"type":0,
"lat": nationalGallery.lat,
"lng": nationalGallery.lng};


console.log('User: Now you can type: ');
rl.on('line', function (cmd) {
  if (cmd == "initDriver") {
  	initDriver();
  }

  // if (cmd == "book") {
  // 	book();
  // }

  if (cmd == "update") {
  	loop = setInterval(updateDriverLoc, 1000);
  }

  if (cmd == "stop") {
  	clearInterval(loop);
  }
});


// function crtFakeDrivers() {
var driverNum = 3;


// if (ioDriverFlag) {

ioDriver.on('drivePath', function(data) {
	console.log("[Drive Path]");
	console.log(data);
});

ioDriver.on('addUser', function(data) {
	console.log("[Been Booked]");
	console.log(data);
});

ioDriver.on('removeUser', function(data) {
	console.log('[User Moved]:');
	console.log(data);
});

ioDriver.on('updateUserLoc', function(data) {
	console.log('[Upate UserLoc]:');
	console.log(data);
});








