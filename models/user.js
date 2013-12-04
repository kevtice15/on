var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	twitter_id: String,
  username: String,
  name: String,
  displayName: String,
	email: String,
	imageUrl: String,
	groups: [mongoose.Schema.ObjectId],
	activity_items: [mongoose.Schema.ObjectId]
});

mongoose.model("User", UserSchema);