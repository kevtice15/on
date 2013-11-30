var express = require('express'),
  app = express(),
  mongodb = require('mongodb'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  TwitterStrategy = require('passport-twitter').Strategy,
  http = require('http'),
	https = require('https'),
	imon = require('./imon');



mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Connected to DB');
});

 var twitterUserSchema = new mongoose.Schema({
      account: { provider: String,
                 id: String},
      username: String,
      name: String,
      displayName: String,
			email: String,
			image: String
  });

var twitterUser= mongoose.model('twitterUser', twitterUserSchema);
var twitterUserInstance = new twitterUser;





// all environments
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ cookie: { maxAge: 60000 }, secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);



// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
}

passport.serializeUser(function(user, done) {
	console.log("SERIALIZE: ", user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
	console.log("DESERIALIZE: ", obj);
  done(null, obj);
});



passport.use(new TwitterStrategy({
    consumerKey: "0GOReNaXWXCTpf7OQgrg",
    consumerSecret: "0wA8yUBrXz3ivpTHcuBbKp3vGN2ODnOF7iFM9DB48Y",
    callbackURL: "http://127.0.0.1:8888/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
		function sanitizeImgURL(string){
			return string.replace("_normal", "");
		}

		console.log("profile: ", profile);
		process.nextTick(function(){
			twitterUser.find({account: {id: profile.id}}, function(err, user) {
      if (err) { return done(err); }
      if(!user){
				return done(null, false, {message: "No user found."});
      }
      var newUser = new twitterUser(
				{account:
					{provider: profile.provider,
					id: profile.id},
				username: profile.username,
				displayName: profile.displayName,
				email: profile.email,
				image: sanitizeImgURL(profile._json.profile_image_url)
			});
			return done(null, newUser);
			});
		});
  }
));

/**
 * Routes
 */

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



app.get("/static/:filename", function(request, response){
	response.sendfile("static/" + request.params.filename);
});

app.get("/static/bootstrap/css/:filename", function(request, response){
	response.sendfile("static/bootstrap/css/" + request.params.filename);
});

app.get("/static/bootstrap/js/:filename", function(request, response){
	response.sendfile("static/bootstrap/js/" + request.params.filename);
});

app.get("/static/lib/:filename", function(request, response){
	response.sendfile("static/lib/" + request.params.filename);
});

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

app.listen(8888);