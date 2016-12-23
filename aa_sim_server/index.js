var socketio = require('socket.io');
var restify = require('restify');
var morgan      = require('morgan');
var config = require('./config'); // get our config file
var socketioJwt = require('socketio-jwt');


var secret = config.secret;



var host = process.env.HOST || 'localhost';
// var port = process.env.PORT || '8080';
var port = 8082;


var server = restify.createServer({
  name: 'AA location simulation server'
});
server.use(restify.jsonBodyParser());

var io = socketio.listen(server.server);



function getNearest(drivers, userData) {
	console.log(drivers);
	var distance = 0, minDistance = Number.MAX_SAFE_INTEGER;
	var socketIds = Object.keys(drivers);
	var matchedSocketId = 0;
	if (socketIds.length == 1) {
		matchedSocketId = socketIds[0];
	} else if (socketIds.length > 1) {
		for (key in socketIds) {
			var lat = drivers[socketIds[key]].latLng[0];
			var lng = drivers[socketIds[key]].latLng[1];

			distance = calDistance(userData.lat, userData.lng, lat, lng);
			if (distance < minDistance) {
				minDistance = distance;
				matchedSocketId = socketIds[key];
			}
		}
	}
	return matchedSocketId;
}







var drivers = {};
var user = {};

io.sockets
  .on('connection', socketioJwt.authorize({
    secret: secret,
    timeout: 1000 // 15 seconds to send the authentication message
  }))
  .on('authenticated', function(socket) {
    //this socket is authenticated, we are good to handle more events from it.
		// console.log('connected & authenticated: ' + JSON.stringify(socket.decoded_token._doc._id));
	  // socket.on('init', function(data) {
			// if (data.isDriver) {
			// 	drivers[socket.id] = {
			// 		id: socket.id,
			// 		latLng: data.latLng

			// 	};
			// 	socket.isDriver = data.isDriver;
			// 	console.log("[Driver Added] at " + socket.id);
			// 	socket.broadcast.to('customers').emit('driverAdded', drivers[socket.id]);

			// } else {
			// 	socket.join('customers');
			// 	console.log("[Customer Added] at " + socket.id);

			// 	var clients = io.sockets.adapter.rooms['customers'];
			// 	socket.emit('initDriverLocList', drivers); 
			// }
  	// });

  	socket.on('initUser', function(data) {
  		socket.join('customers');
			console.log("[Customer Added] at " + socket.id);
			user[socket.id] = {
				id:socket.id,
				latLng: data.latLng
			}
			socket.broadcast.to('customers').emit('initDriverLocList', drivers); 
  	});

  	socket.on('initDriver', function(data) {
  		drivers[socket.id] = {
  			id: socket.id,
  			latLng: data.latLng
  		}
			console.log("[Driver Added] at " + socket.id);
			socket.broadcast.to('customers').emit('addDrivers', drivers[socket.id]);  		
  	});

	  socket.on('book', function(customerData) {
			var resData ={};
			var matchedSocketId = getNearest(drivers, customerData);
			console.log(matchedSocketId);
			resData.id = matchedSocketId;	// id of booked car
			if (matchedSocketId == 0) {
				socket.emit('bookid', resData);
			} else {
				socket.emit('bookid', resData);
				socket.broadcast.to(matchedSocketId).emit('drivePath', customerData);
			}
		});


	  socket.on('updateDriverLoc', function(data) {
			drivers[socket.id] = {
				id: socket.id,
				latLng: data.latLng
			}
			socket.broadcast.to('customers').emit('updateDriverLoc', {
				id: socket.id,
				latLng: data.latLng
			})
		});

	  socket.on('updateUserLoc', function(data) {
			// drivers[socket.id] = {
			// 	id: socket.id,
			// 	latLng: data.latLng
			// }
			// socket.broadcast.to('customers').emit('updateUserLoc', {
			// 	id: socket.id,
			// 	latLng: data.latLng
			// })
		});


		socket.on('disconnect', function() {
			if (socket.isDriver) {
				delete drivers[socket.id];			
				console.log("[Driver Disconnected] at: " + socket.id);
				socket.broadcast.to('customers').emit('removeDrivers', drivers[socket.id]);
			}
			 else {
				console.log("[Customer Disconnected] at: " + socket.id);
			}
		});


  });



server.listen(port,host, function() {
  console.log('%s listening at %s at time %s', server.name, server.url,  new Date().toLocaleString().substr(0, 12));
});

