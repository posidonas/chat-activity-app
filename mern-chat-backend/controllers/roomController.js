const asyncHandler = require("express-async-handler");
const Room = require("../models/Rooms");
const moment = require("moment");

const getAppRooms = asyncHandler(async (req, res) => {
	const rooms = await Room.find();
	res.status(200).json(rooms);
});

const setAppRoom = asyncHandler(async (req, res) => {
	const newRoomUser = req.body.roomUser;
	const newRoomName = req.body.roomName;
	const newRoomType = req.body.roomType;
	const newRoomDate = req.body.roomDate;
	const newRoomDescription = req.body.roomDescription;
	if (!req.body.roomName) {
		res.status(400);
		throw new Error("Please add a text field");
	}
	const rooms = await Room.create({
		roomUser: newRoomUser,
		roomName: newRoomName,
		roomType: newRoomType,
		roomDate: newRoomDate,
		roomDescription: newRoomDescription,
	});
	res.status(200).json(rooms);
});

const updateAppRoom = asyncHandler(async (req, res) => {
	const rooms = await Room.findById(req.params.id);
	if (!rooms) {
		res.status(400);
		throw new Error("Room not Found");
	}
	const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.status(200).json(updatedRoom);
});

const deleteAppRoom = asyncHandler(async (req, res) => {
	const id = req.params.id;
	await Room.findByIdAndRemove(id).exec();
	res.end("deleted");
});
// console.log(moment());
// const testdeleteAppRoom = async (req, res) => {
// 	const rooms = await Room.find(roomDate);
// 	res.status(200).json(rooms);
// };
// const test = Room.find().select("roomDate");

// console.log(test);

// const autoDeleteAppRoom = asyncHandler(async (req, res) => {
// 	if (moment(req.params.roomDate).unix() < moment().format("X")) {
// 		deleteAppRoom;
// 		console.log("test");
// 		// await Room.findByIdAndRemove(id).exec();
// 		// res.end("deleted");
// 	}
// });

module.exports = {
	getAppRooms,
	setAppRoom,
	updateAppRoom,
	deleteAppRoom,
};
