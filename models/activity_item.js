var mongoose = require('mongoose');

var ActivityItemSchema = new mongoose.Schema({
	timestamp: {type: Date, default: Date.now},
	user: mongoose.Schema.ObjectId,
	song: mongoose.Schema.ObjectId,
	group: mongoose.Schema.ObjectId
});
mongoose.model("ActivityItem", ActivityItemSchema);