var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
	title: String,
	acivity_items: [mongoose.Schema.ObjectId],
	members: [mongoose.Schema.ObjectId]
});

mongoose.model("Group", GroupSchema);