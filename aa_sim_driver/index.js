var socketClient = require('socket.io-client');
var readline = require('readline');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var host = process.env.HOST || '127.0.0.1';
// var port = process.env.PORT || '8080';
var port = 8082;

var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwicG9wdWxhdGVkIjp7InBldHMiOnsidmFsdWUiOlsiNTgxN2U2OGQ2NDRiZDg5ZDQ0Y2NiMjIzIiwiNTgxNzk0ZmViYjViNjQ5MzcyODRlMTQ1IiwiNTgzMGY5OGZhZWVkZjU0NDIyY2Q3MzlmIiwiNTgzMGZhMjZhZWVkZjU0NDIyY2Q3M2EwIiwiNTgzMGZjNWJhZWVkZjU0NDIyY2Q3M2ExIiwiNTgzMGZkNDlhZWVkZjU0NDIyY2Q3M2EyIiwiNTg1NzEzNTg5YjQwODUwYmU3NzE3NWY3Il0sIm9wdGlvbnMiOnsicGF0aCI6InBldHMiLCJzZWxlY3QiOiJiYXNpYy5uYW1lIiwiX2RvY3MiOnsiNTgyZTM3NWU4OWQ2MmExZGUwY2U4OTVlIjpbIjU4MTdlNjhkNjQ0YmQ4OWQ0NGNjYjIyMyIsIjU4MTc5NGZlYmI1YjY0OTM3Mjg0ZTE0NSIsIjU4MzBmOThmYWVlZGY1NDQyMmNkNzM5ZiIsIjU4MzBmYTI2YWVlZGY1NDQyMmNkNzNhMCIsIjU4MzBmYzViYWVlZGY1NDQyMmNkNzNhMSIsIjU4MzBmZDQ5YWVlZGY1NDQyMmNkNzNhMiIsIjU4NTcxMzU4OWI0MDg1MGJlNzcxNzVmNyJdfSwiaXNWaXJ0dWFsIjpmYWxzZX19fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicGFzc3dvcmQiOiJpbml0IiwiZW1haWwiOiJpbml0IiwicGV0cyI6ImluaXQiLCJ1cGRhdGVkQXQiOiJpbml0IiwiY3JlYXRlZF9hdCI6ImluaXQiLCJhdmF0YXIiOiJpbml0IiwiX192IjoiaW5pdCIsImFjdGl2YXRlZCI6ImluaXQiLCJwaG9uZV9ubyI6ImluaXQiLCJmaXJzdF9uYW1lIjoiaW5pdCIsImxhc3RfbmFtZSI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJ1cGRhdGVkQXQiOnRydWUsImNyZWF0ZWRfYXQiOnRydWUsImF2YXRhciI6dHJ1ZSwiX192Ijp0cnVlLCJwZXRzIjp0cnVlLCJhY3RpdmF0ZWQiOnRydWUsInBob25lX25vIjp0cnVlLCJmaXJzdF9uYW1lIjp0cnVlLCJsYXN0X25hbWUiOnRydWUsInBhc3N3b3JkIjp0cnVlLCJlbWFpbCI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7fSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwiZW1pdHRlciI6eyJkb21haW4iOm51bGwsIl9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9fSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7InBldHMiOlt7Il9pZCI6IjU4MzBmYzViYWVlZGY1NDQyMmNkNzNhMSJ9LHsiX2lkIjoiNTgzMGZkNDlhZWVkZjU0NDIyY2Q3M2EyIiwiYmFzaWMiOnsibmFtZSI6IlBla2luZyJ9fSx7Il9pZCI6IjU4NTcxMzU4OWI0MDg1MGJlNzcxNzVmNyIsImJhc2ljIjp7Im5hbWUiOiJZaXJhbiJ9fV0sInVwZGF0ZWRBdCI6IjIwMTYtMTItMThUMjI6NTM6MTIuODA4WiIsImNyZWF0ZWRfYXQiOiIyMDE2LTEyLTE4VDIyOjUzOjEyLjgwOFoiLCJhdmF0YXIiOiJodHRwOi8vcmVzLmNsb3VkaW5hcnkuY29tL2Fsd2F5c2Fyb3VuZC9pbWFnZS91cGxvYWQvdjE0ODIwMTg5Mzkvc2ZoNGx0a2ZrbmI3c3lzNmh5dW0ucG5nIiwiX192Ijo1LCJhY3RpdmF0ZWQiOmZhbHNlLCJwaG9uZV9ubyI6MTIzMTIzNCwiZmlyc3RfbmFtZSI6InlpcmFuIiwibGFzdF9uYW1lIjoidGFvIiwicGFzc3dvcmQiOiIkMmEkMDUkVFZDUUtYNEd5eFo3MTM5R29oeHU3dU1LRTBHUzhhY3Y3SWFjTzI5eEVzWUg1a2JCNE1Ea08iLCJlbWFpbCI6Inl0MjQ4N0Bjb2x1bWJpYS5lZHUiLCJfaWQiOiI1ODJlMzc1ZTg5ZDYyYTFkZTBjZTg5NWUifSwiX3ByZXMiOnsiJF9fb3JpZ2luYWxfc2F2ZSI6W251bGwsbnVsbCxudWxsLG51bGxdLCIkX19vcmlnaW5hbF92YWxpZGF0ZSI6W251bGxdLCIkX19vcmlnaW5hbF9yZW1vdmUiOltudWxsXX0sIl9wb3N0cyI6eyIkX19vcmlnaW5hbF9zYXZlIjpbXSwiJF9fb3JpZ2luYWxfdmFsaWRhdGUiOltdLCIkX19vcmlnaW5hbF9yZW1vdmUiOltdfSwiaWF0IjoxNDgzMTE1NTk2LCJleHAiOjE0ODU3MDc1OTZ9.WW_Kra4jTD2nxw1xqTNCq664gzT6fmS8Ea7kciuKQLM";

var nationalGallery = {lat: 51.508929, lng: -0.128299};

var ucl = {lat: 51.524559, lng: -0.13404};

var ioDriver = {};
var ioDriverFlag = false;
var ioDriverNew = {};
var groupLoop = "";
var pairLoop = "";

var ioDriver = socketClient.connect("http://127.0.0.1:8080/commonroom", {
											'force new connection': true
										});
 

ioDriver.on('connect', function () {
	console.log('[Driver CommonRoom] Connected');
  ioDriver
    .emit('authenticate', {token: token}) //send the jwt
    .on('authenticated', function () {
      //do other things

    })
    .on('unauthorized', function(err) {
      console.log("unauthorized: " + JSON.stringify(err.data));
    })
});




function initDriver(){
	var driverMarker = {latLng: [nationalGallery.lat, nationalGallery.lng]};
	ioDriver.emit('initDriver', driverMarker);
}

function forceDisconn() {
	ioDriver.emit('forceDisconnect');
}


var driverMarkerUpdate = {latLng: [nationalGallery.lat + randomFloat(0.0, 0.2), ucl.lng + randomFloat(0.0, 0.2)]};

function groupUpdate() {
	ioDriver.emit('updateDriverListLoc', driverMarkerUpdate);
}


function pairInit() {

	ioDriverNew = socketClient.connect("http://127.0.0.1:8080/random", {
												'force new connection': true
											});
	ioDriverNew.on('connect', function(socket){
		console.log('[Driver Pair] Connected');
		ioDriverNew.emit('initPairDriver');
	}); 	
}

function pairMatching() {
		// pair events
	ioDriverNew.on('updateUserLoc', function(data) {
		console.log('[Target User LocChanged]:');
		console.log(data);
	});
}

function pairUpdate() {
	ioDriverNew.emit('updateDriverLoc', driverMarkerUpdate);

}



function randomFloat(low, high) {
	var low = 0.01;
	var high = 0.02;
	return (Math.random() * (high - low) + low);
}




// function book() {
// 	// ioDriver.emit('book', driverMarker);
// 	ioDriverNew.emit('updateDriverLoc', "ok");
// }


console.log('User: Now you can type: \n');

console.log('For Stage 1: \n initDriver, groupUpdate, forceDisconn, stopGroup');
console.log('For Stage 2: \n pairInit, pairUpdate, pairMatching, stopPair');

rl.on('line', function (cmd) {
  if (cmd == "initDriver") {
  	initDriver();
  }
  if (cmd == "pairInit") {
  	pairInit();
  }

  if (cmd == "forceDisconn") {
  	forceDisconn();
  }

  if (cmd == "pairMatching") {
  	pairMatching();
  }

  if (cmd == "groupUpdate") {
  	groupLoop = setInterval(groupUpdate, 1000);
  }

  if (cmd == "pairUpdate") {
  	pairLoop = setInterval(pairUpdate, 1000);
  }

  if (cmd == "stopPair") {
  	clearInterval(pairLoop);
  }

  if (cmd == "stopGroup") {
  	clearInterval(groupLoop);
  }
});


// group events
ioDriver.on('initUserLocList', function(data) {
	console.log('[RCV Users]:');
	console.log(data);
});

ioDriver.on('addUser', function(data) {
	console.log('[ADD Users]:');
	console.log(data);
});

ioDriver.on('removeUsers', function(data) {
	console.log('[Users Removed]:');
	console.log(data);
});

ioDriver.on('updateUserListLoc', function(data) {
	console.log('[User LocChanged]:');
	console.log(data);
});






// ioDriver.on('bookid', function(data) {
// 	console.log('[BOOKED]');
// 	if (data.id == 0) {
// 		// not available, no cars available
// 		console.log('no driver matched');
// 	} else {
// 		// book has been confirmed
// 		console.log("your book has been confirmed.");
// 		// then ETA, e.g. 5min on the way
// 	}
// });