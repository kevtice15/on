var express = require('express');

var app = express();

var http = require('http');
var https = require('https');

var RedisStore = require('connect-redis')(express);

var mongodb = require('mongodb');
var mongoose = require('mongoose');

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var TWITTER_CONSUMER_KEY = "0GOReNaXWXCTpf7OQgrg";
var TWITTER_CONSUMER_SECRET = "0wA8yUBrXz3ivpTHcuBbKp3vGN2ODnOF7iFM9DB48Y";
var TWITTER_CALLBACK_URL = "http://127.0.0.1:8888/auth/twitter/callback";


var imon = require('./imon');
var users = require("./models/user");
var group = require('./models/group');
var song = require('./models/song');
var album = require('./models/album');
var activity_item = require('./models/activity_item');


passport.serializeUser(function(user, done) {
	console.log("SERIALIZE: ", user.id);
	//TODO Serialize user.id
  done(null, user.id);
});

passport.deserializeUser(function(obj, done) {
	//TODO Deserialize user find by twitter id
	var User = mongoose.model('User');
	User.findOne({_id: obj}, function(err, foundUser){
		if(err){
			return done(err);
		}
		console.log("DESERIALIZE: ", foundUser);
		done(null, foundUser);
  });
});


passport.use(new TwitterStrategy({
		consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: TWITTER_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
		console.log("This gets called?");
		function sanitizeImgURL(string){
			return string.replace("_normal", "");
		}

		console.log("profile: ", profile);
		process.nextTick(function(){
			var User = mongoose.model('User');
			User.findOne({twitter_id: profile.id}, function(err, foundUser){
				if(err){
					return done(err);
				}
				if(foundUser){
					console.log("FOUND THE USER++++++++++++++++++++++++");
					return done(null, foundUser);
				}
				console.log("NEW PROF ID", profile.id);
				var newUser = new User({
					twitter_id: profile.id,
					username: profile.username,
					displayName: profile.displayName,
					email: profile.email,
					imageUrl: sanitizeImgURL(profile._json.profile_image_url)
				});
				newUser.save(function(err){
					if(err){
						console.log("ERROR - Cannot save new user");
					}
				});
				return done(null, newUser);
			});
		});
  })
);

		// 	User.find({account: {id: profile.id}}, function(err, user) {
		// 		if(err){
		// 			return done(err);
		// 		}
		// 		if(!user){
		// 			return done(null, false, { message: 'Incorrect password.' });
		// 		}
		// 		else if(user){
		// 			done(null, user);
		// 		}
		// 		var newUser = new User(
		// 			{account:
		// 				{provider: profile.provider,
		// 				id: profile.id},
		// 			username: profile.username,
		// 			displayName: profile.displayName,
		// 			email: profile.email,
		// 			image: sanitizeImgURL(profile._json.profile_image_url)
		// 		});
		// 	});
// 		// 	return done(null, profile);
// 		// });
//   }
// ));



app.set('env', 'development');

console.log("app.get('env') =", app.get('env'));
console.log(app.get('env') === 'development');

// development only
if (app.get('env') === 'development') {
	app.configure(function(){
		app.set('views', __dirname + '/views');
		app.set('port', 8888);
		app.use(express.logger('dev'));
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.bodyParser());
		app.use(express.session({secret: "elsecreto"}));
		// app.use(express.session({
		// 	store: new RedisStore({
		// 		host: 'localhost',
		// 		port: 6379,
		// 		db: 2,
		// 		pass: 'RedisPASS'
		// 	}),
		// 	secret: '1234567890'
		// }));
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(express.errorHandler());
		app.use(app.router);
	});
}

// production only
if (app.get('env') === 'production') {
  // TODO
}


// all environments


mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Connected to DB');
});


/**
 * Routes
 */

var routes = require('./routes')(app);



// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/static/index.html',
                                     failureRedirect: '/static/login.html' }));




//Get activity for users or groups
app.get("/activity", function(request, response){
	var query = request.query;
	var responseData;
	if(query.group_id){
		console.log("Query for group activity");
		responseData = imon.getGroupActivity(query.group_id);
		response.send({
			sucess: (request.params !== undefined),
			data: responseData
		});
	}
	else if(query.user_id){
		console.log("Query for user activity");
		responseData = imon.getUserActivity(query.user_id);
		console.log("User activity response: ", responseData);
		response.send({
			sucess: (request.params !== undefined),
			data: responseData
		});
	}
	else{
		console.log("Invalid query for activity");
	}
});

//Get group by user id
app.get("/groups/:user_id", function(request, response){
	var userWhoseGroupsToGet = Number(request.params.user_id);
	var theUsersGroups = imon.getUserGroups(userWhoseGroupsToGet);
	console.log("userGroups: ", theUsersGroups, theUsersGroups[0].activity);
	response.send({
		success: (request.params !== undefined),
		data: theUsersGroups
	});
});

//Get members by group
app.get("/members/:group_id", function(request, response){
	var groupWhoseMembersToGet = Number(request.params.user_id);
	var theGroupMembers = imon.getGroupUsers(groupWhoseMembersToGet);
	response.send({
		success: (request.params !== undefined),
		data: theGroupMembers
	});
});


//Get user by id
app.get("/users/:user_id", function(request, response){
	console.log("GET USER sess: ", request.session);
	console.log("GET USER user: ", request.user);
	var userToGet = Number(request.params.user_id);
	//var theUser = imon.getUser(userToGet);
	var theUser = request.user;
	console.log("Got user: ", theUser);
	response.send({
		success: (request.params !== undefined),
		data: theUser
	});
});

//Get songs by group
app.get("/songs/:group_id", function(request, response){
	var groupWhoseSongsToGet = Number(request.params.group_id);
	var theSongs = imon.getGroupSongs(groupWhoseSongsToGet);
	console.log("Got songs: ", theSongs);
	response.send({
		success: (request.params !== undefined),
		data: theSongs
	});
});


//Add a new song
app.post("/song", function(request, response){
	console.log("REQUEST BODY: ", request.body);
	var songToAdd = request.body.song;
	imon.addSong(8, request.body.group.id, songToAdd);
	response.send({
		success: (request.body !== undefined)
	});
});

//Add a new song
app.post("/group", function(request, response){
	console.log("REQUEST BODY: ", request.body);
	var groupToAdd = request.body.group;
	imon.addGroup(8, groupToAdd);
	response.send({
		success: (request.body !== undefined)
	});
});

//Add a new song
app.post("/album", function(request, response){
	console.log("REQUEST BODY: ", request.body);
	var albumToAdd = request.body.album;
	imon.addAlbum(8, request.body.group.id, albumToAdd);
	response.send({
		success: (request.body !== undefined)
	});
});

// //FOR TESTING imon.js

// console.log("adding new group: ", imon.addGroup(8, {title: "Yeezy"}));
// console.log("adding new album: ", imon.addAlbum(8, 2, {title: "Yeezus"}));
// console.log("adding new song: ", imon.addSong(8, 2, {title: "Blood on the Leaves", artist: "Kanye", album: "Yeezus", group_id: "2"}));

// console.log("user 8's groups: ", imon.getUserGroups(8));
// console.log("group 1's members: ", imon.getGroupUsers(1));
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
