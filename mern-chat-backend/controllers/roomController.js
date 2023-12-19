const asyncHandler = require("express-async-handler");
const Room = require("../models/Rooms");
const User = require("../models/User");
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

const updateRoom = asyncHandler(async (req, res) => {
	const { updateType } = req.body;
	if (updateType === "updateRoom") {
		const room = await Room.findById(req.params.id);
		if (!room) {
			res.status(400);
			throw new Error("Room not found");
		}
		const updatedRoom = await Room.findByIdAndUpdate(
			req.params.id,
			{
				roomName: req.body.roomName,
				roomDate: req.body.roomDate,
				roomDescription: req.body.roomDescription,
			},
			{
				new: true,
			}
		);
		res.status(200).json(updatedRoom);
	}
});

const updateMembers = asyncHandler(async (req, res) => {
	const { updateType } = req.body;
	if (updateType === "updateMembers") {
		try {
			const room = await Room.findById(req.params.id);
			if (!room) throw new Error("Room not found");
			if (!Array.isArray(room.members)) {
				room.members = [];
			}
			const user = await User.findById(req.body.members);
			const userId = user._id;
			const currentRooms = await Room.find({ members: userId });
			currentRooms.forEach(async (currentRoom) => {
				if (currentRoom._id.toString() === room._id.toString()) return;
				const index = currentRoom.members.indexOf(userId);
				currentRoom.members.splice(index, 1);
				await currentRoom.save();
			});
			if (room.members.indexOf(userId) === -1) {
				room.members = [...room.members, userId];
				await room.save();
			}

			res.status(200).json({ success: true });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}
});

const deleteAppRoom = asyncHandler(async (req, res) => {
	const id = req.params.id;
	await Room.findByIdAndRemove(id).exec();
	res.end("deleted");
});

module.exports = {
	getAppRooms,
	setAppRoom,
	updateRoom,
	updateMembers,
	deleteAppRoom,
};
