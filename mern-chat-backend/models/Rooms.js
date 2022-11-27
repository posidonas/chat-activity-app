const mongoose = require("mongoose");

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
		to: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
