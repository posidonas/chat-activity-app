const express = require("express");
const asyncHandler = require("express-async-handler");
const app = express();
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const activityRoutes = require("./routes/activityRoutes");
const activitySubscribedRoutes = require("./routes/activitySubscribedRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const User = require("./models/User");
const Message = require("./models/Message");
const Room = require("./models/Rooms");
const Activities = require("./models/Activities");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const moment = require("moment");
var assert = require("assert");

const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const { result } = require("lodash");
const viewPath = path.resolve(__dirname, "./templates/views/");
const partialsPath = path.resolve(__dirname, "./templates/partials");
app.use(express.static(path.join(__dirname, "./public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/users:id", userRoutes);

require("./connection");

app.use("/rooms", roomRoutes);
app.use("/rooms/user", roomRoutes);

app.use("/rooms:id", roomRoutes);

app.use("/rooms/hiking", roomRoutes);

app.use("/rooms/hiking:id", roomRoutes);

app.use("/messages", messagesRoutes);

app.use("/myrooms", roomRoutes);
app.use("/myrooms:id", roomRoutes);

app.use("/activities", activityRoutes);

app.use("/activities:id", activityRoutes);

app.use("/favorites", activitySubscribedRoutes);

app.use("/favorites:id", activitySubscribedRoutes);

app.use(errorHandler);

const server = require("http").createServer(app);
const PORT = 5001;
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

function deletedRoomEmail() {
	const date = moment().add(-3, "minutes");

	Room.distinct(
		"roomUserEmail",
		{ roomDate: { $lte: date } },
		function (err, resultDeleted) {
			if (err) return handleError(err);

			assert(Array.isArray(resultDeleted));
			console.log(resultDeleted.toString());

			const sendMailDeleted = () => {
				var transporter = nodemailer.createTransport({
					service: "gmail",
					auth: {
						user: "yiannis3030@gmail.com",
						pass: "yqhzyhcuqarxhwqa",
					},
				});
				transporter.use(
					"compile",
					hbs({
						viewEngine: {
							extName: ".handlebars",
							// partialsDir: viewPath,
							layoutsDir: viewPath,
							defaultLayout: false,
							partialsDir: partialsPath,
							express,
						},
						viewPath: viewPath,
						extName: ".handlebars",
					})
				);
				// "yiannis30@hotmail.com"
				var mailOptions = {
					from: "yiannis3030@gmail.com",
					to: resultDeleted,
					subject: "Room Deleted. ChatCTIVITIES Notifications",
					template: "roomDeleted",
				};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log("Email sent: " + info.response);
					}
				});
			};
			if (resultDeleted.toString() !== "") {
				sendMailDeleted();
			}
		}
	);
}
async function deletePastRooms() {
	const date = moment().add(-3, "minutes");
	let roomDates = await Room.deleteMany({ roomDate: { $lte: date } });
	console.log(date);
	return roomDates;
}

let emailSend = false;
async function expiredRoomEmail() {
	const date = moment();
	Room.distinct(
		"roomUserEmail",
		{ roomDate: { $lte: date } },
		function (err, resultExpired) {
			if (err) return handleError(err);

			assert(Array.isArray(resultExpired));
			console.log(resultExpired.toString());

			const sendMailExpired = (room) => {
				var transporter = nodemailer.createTransport({
					service: "gmail",
					auth: {
						user: "yiannis3030@gmail.com",
						pass: "yqhzyhcuqarxhwqa",
					},
				});
				transporter.use(
					"compile",
					hbs({
						viewEngine: {
							extName: ".handlebars",
							// partialsDir: viewPath,
							layoutsDir: viewPath,
							defaultLayout: false,
							partialsDir: partialsPath,
							express,
						},
						viewPath: viewPath,
						extName: ".handlebars",
					})
				);
				// "yiannis30@hotmail.com"
				var mailOptions = {
					from: "yiannis3030@gmail.com",
					to: resultExpired,
					subject: "Expired Room. ChatCTIVITIES Notifications",
					template: "roomExpired",
				};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log("Email sent: " + info.response);
					}
				});
			};
			if (resultExpired.toString() !== "" && emailSend === false) {
				sendMailExpired();
				emailSend = true;
			} else if (resultExpired.toString() === "") {
				emailSend = false;
			}
		}
	);
}

function expiredPastRooms() {
	const date = moment();
	Room.updateMany(
		{ roomDate: { $lte: date } },
		{ expired: "true" },
		function (err, docs) {
			if (err) {
				console.log(err);
			} else {
				console.log("Updated Docs : ", docs);
			}
		}
	);
}

setInterval(async () => {
	deletedRoomEmail();
	await deletePastRooms();

	expiredPastRooms();
	await expiredRoomEmail();

	const deleteRoom = await Room.find();

	io.emit("room-delete", deleteRoom);
}, 30000);

async function getLastMessagesFromRoom(room) {
	let roomMessages = await Message.aggregate([
		{ $match: { to: room } },
		{ $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
	]);
	return roomMessages;
}

function sortRoomMessagesByDate(messages) {
	return messages.sort(function (a, b) {
		let date1 = a._id.split("/");
		let date2 = b._id.split("/");
		// do stuff with arr
		date1 = date1[2] + date1[0] + date1[1];
		date2 = date2[2] + date2[0] + date2[1];
	});
}

// socket connection
io.on("connection", (socket) => {
	socket.on("new-user", async () => {
		const members = await User.find();
		io.emit("new-user", members);
	});

	socket.on("join-room", async (newRoom, previousRoom) => {
		socket.join(newRoom);
		socket.leave(previousRoom);
		let roomMessages = await getLastMessagesFromRoom(newRoom);
		roomMessages = sortRoomMessagesByDate(roomMessages);
		socket.emit("room-messages", roomMessages);
	});

	socket.on(
		"message-room",
		async (room, content, sender, time, date, messageRoomType) => {
			const newMessage = await Message.create({
				content,
				from: sender,
				time,
				date,
				to: room,
				messageRoomType: messageRoomType,
			});
			let roomMessages = await getLastMessagesFromRoom(room);
			roomMessages = sortRoomMessagesByDate(roomMessages);
			// sending message to room
			io.to(room).emit("room-messages", roomMessages);
			socket.broadcast.emit("notifications", room);
		}
	);

	socket.on(
		"new-room",
		async (
			room,
			newRoomName,
			newRoomUser,
			newRoomType,
			newRoomDate,
			newRoomDescription,
			newRoomUserEmail,
			expired
		) => {
			const newRoom = await Room.create({
				roomName: newRoomName,
				roomUser: newRoomUser,
				roomType: newRoomType,
				roomDate: newRoomDate,
				roomDescription: newRoomDescription,
				roomUserEmail: newRoomUserEmail,
				expired: expired,
				to: room,
			});
			// let roomNew = await getLastRoom(room);
			// roomNew = sortRoomByDate(roomNew);

			// sending message to room
			const roomNew = await Room.find();
			io.to(room).emit("room-new", roomNew);
		}
	);

	// socket.on("new-room1", async (newMembers, updateType, roomId) => {
	// 	Room.findById(roomId).then((room) => {
	// 		room.members = newMembers;
	// 		room.updateType = updateType;
	// 		room.save().then(() => {
	// 			User.find().then((members) => {
	// 				io.emit("new-user", members);
	// 			});
	// 		});
	// 	});
	// });

	socket.on("delete-room", async (room) => {
		const deleteRoom = await Room.find({});
		io.emit("room-delete", deleteRoom);
	});

	socket.on("update-room", async (room) => {
		const updateRoom = await Room.find({
			to: room,
		});
		io.emit("room-update", updateRoom);
	});

	app.delete("/logout", async (req, res) => {
		try {
			const { _id, newMessages } = req.body;
			const user = await User.findById(_id);
			user.status = "offline";
			user.newMessages = newMessages;
			await user.save();
			const members = await User.find();
			socket.broadcast.emit("new-user", members);
			res.status(200).send();
		} catch (e) {
			console.log(e);
			res.status(400).send();
		}
	});
});

server.listen(PORT, () => {
	console.log("listening to port", PORT);
});
