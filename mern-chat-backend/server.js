const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const activityRoutes = require("./routes/activityRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const User = require("./models/User");
const Message = require("./models/Message");

const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
require("./connection");

app.use("/rooms", roomRoutes);

app.use("/rooms:id", roomRoutes);

app.use("/rooms/hiking", roomRoutes);

app.use("/rooms/hiking:id", roomRoutes);

app.use("/messages", messagesRoutes);

app.use("/rooms/myrooms", roomRoutes);

app.use("/activities", activityRoutes);

app.use("/activities:id", activityRoutes);

app.use(errorHandler);

const server = require("http").createServer(app);
const PORT = 5001;
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

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
