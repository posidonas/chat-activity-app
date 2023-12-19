const mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");
require("dotenv").config();

const RoomSchema = new mongoose.Schema(
	{
		roomName: {
			type: String,
			require: [true, "Please add a Room"],
		},
		roomUser: {
			type: String,
		},
		roomDate: {
			type: Date,
			require: [true, "Please add a Date"],
		},
		roomType: {
			type: String,
		},
		roomDescription: {
			type: String,
		},
		roomUserEmail: {
			type: String,
		},
		expired: {
			type: String,
		},
		to: {
			type: String,
		},
		members: [],
		updateType: {
			type: String,
		},
	},
	{ timestamps: true }
);
RoomSchema.methods.toJSON = function () {
	var obj = this.toObject();
	delete obj.roomUserEmail;
	return obj;
};

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
