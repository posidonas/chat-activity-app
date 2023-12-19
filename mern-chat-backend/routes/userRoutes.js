const router = require("express").Router();
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const updateAppUser = asyncHandler(async (req, res) => {
	const rooms = await User.findById(req.params.id);
	if (!rooms) {
		res.status(400);
		throw new Error("User not Found");
	}
	const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.status(200).json(updatedUser);
});
router.route("/:id").put(updateAppUser);
// creating user
router.post("/", async (req, res) => {
	try {
		const {
			name,
			email,
			password,
			picture,
			favoriteSoccer,
			favoriteHiking,
			favoriteBasketball,
		} = req.body;
		console.log(req.body);
		const user = await User.create({
			name,
			email,
			password,
			picture,
			favoriteSoccer,
			favoriteHiking,
			favoriteBasketball,
		});
		res.status(201).json(user);
	} catch (e) {
		let msg;
		if (e.code == 11000) {
			msg = "User already exists";
		} else {
			msg = e.message;
		}
		console.log(e);
		res.status(400).json(msg);
	}
});

// login user

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findByCredentials(email, password);
		user.status = "online";
		await user.save();
		res.status(200).json(user);
	} catch (e) {
		res.status(400).json(e.message);
	}
});
const getActivitiesSubscribedUser = asyncHandler(async (req, res) => {
	const activitiesSubscribedUser = await User.find();
	res.status(200).json(activitiesSubscribedUser);
});
router.route("/:id").get(getActivitiesSubscribedUser);

const patchActivitiesSubscribed = asyncHandler(async (req, res) => {
	// Find the activity in the database
	const activity = await User.findById(req.params.id);
	if (!activity) {
		res.status(400);
		throw new Error("Activity not found");
	}

	// Toggle the favorite status
	activity[req.body.activity] = !activity[req.body.activity];
	// Save the updated activity to the database
	const updatedActivity = await activity.save();

	res.status(200).json(updatedActivity);
});
router.route("/:id").patch(patchActivitiesSubscribed);
module.exports = router;
