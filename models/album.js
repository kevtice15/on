var mongoose = require('mongoose');

var AlbumSchema = new mongoose.Schema({
	title: String,
	artist: String,
	highlights: [mongoose.Schema.ObjectId]
});

mongoose.model("Album", AlbumSchema);