var users = require('./controllers/users');
var groups = require('./controllers/groups');
var albums = require('./controllers/albums');
var songs = require('./controllers/songs');
var activity_items = require('./controllers/activity_items');

module.exports = function(app){
	//Static routes
	app.get("/static/:filename", function(request, response){
		console.log("request.session: ", request.passport);
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

	//User routes
	app.post("/users", function(request, response){
		users.create(request, response);
	});

	app.get("/users", function(request, response){
		users.retrieve(request, response);
	});

	app.get("/users/:id", function(request, response){
		users.retrieve(request, response);
	});

	app.put("/users/:id", function(request, response){
		users.update(request, response);
	});

	app.delete("/users/:id", function(request, response){
		users.del(request, response);
	});

	//Group routes
	app.post("/groups", function(request, response){
		groups.create(request, response);
	});

	app.get("/groups", function(request, response){
		groups.retrieve(request, response);
	});

	app.get("/groups/:id", function(request, response){
		groups.retrieve(request, response);
	});

	app.put("/groups/:id", function(request, response){
		groups.update(request, response);
	});

	app.delete("/groups/:id", function(request, response){
		groups.del(request, response);
	});

	//Album routes
	app.post("/albums", function(request, response){
		albums.create(request, response);
	});

	app.get("/albums", function(request, response){
		albums.retrieve(request, response);
	});

	app.get("/albums/:id", function(request, response){
		albums.retrieve(request, response);
	});

	app.put("/albums/:id", function(request, response){
		albums.update(request, response);
	});

	app.delete("/albums/:id", function(request, response){
		albums.del(request, response);
	});

	//Song routes
	app.post("/songs", function(request, response){
		songs.create(request, response);
	});

	app.get("/songs", function(request, response){
		songs.retrieve(request, response);
	});

	app.get("/songs/:id", function(request, response){
		songs.retrieve(request, response);
	});

	app.put("/songs/:id", function(request, response){
		songs.update(request, response);
	});

	app.delete("/songs/:id", function(request, response){
		songs.del(request, response);
	});

	//Activity item routes
	app.post("/activity_items", function(request, response){
		activity_items.create(request, response);
	});

	app.get("/activity_items", function(request, response){
		activity_items.retrieve(request, response);
	});

	app.get("/activity_items/:id", function(request, response){
		activity_items.retrieve(request, response);
	});

	app.put("/activity_items/:id", function(request, response){
		activity_items.update(request, response);
	});

	app.delete("/activity_items/:id", function(request, response){
		activity_items.del(request, response);
	});

};