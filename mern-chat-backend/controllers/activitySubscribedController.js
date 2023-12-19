const asyncHandler = require("express-async-handler");
const ActivitiesSubscribed = require("../models/ActivitiesSubscribed");
const mongoose = require("mongoose");
const User = require("../models/User");

const getActivitiesSubscribed = asyncHandler(async (req, res) => {
	const activitiesSubscribed = await ActivitiesSubscribed.find();
	res.status(200).json(activitiesSubscribed);
});

// Check if the "111" collection exists
// Check if the "111" collection exists
// const collectionExists = mongoose.connection
// 	.modelNames()
// 	.includes("ActivitiesSubscribed");
// if (collectionExists) {
// 	// Collection does not exist, so create it
// 	mongoose.connection.createCollection("ActivitiesSubscribed", (err, res) => {

// 		const documents = [
// 			{
// 				activitySubscribed: false,
// 				activitySubscribedName: "Soccer",
// 				activitySubscribedUser: User._id,
// 			},
// 			{
// 				activitySubscribed: false,
// 				activitySubscribedName: "Hiking",
// 				activitySubscribedUser: User._id,
// 			},
// 			{
// 				activitySubscribed: false,
// 				activitySubscribedName: "Basketball",
// 				activitySubscribedUser: User._id,
// 			},
// 		];

// 		ActivitiesSubscribed.create(documents, function (err, res) {
// 			if (err) throw err;
// 			console.log("Collection created with static data!");
// 		});
// 		console.log("Collection created!");
// 		// mongoose.connection.close();
// 	});
// } else {
// 	console.log("Collection already exists!");
// 	// mongoose.connection.close();
// }

// const setActivitiesSubscribed = asyncHandler(async (req, res) => {
// 	const newActivitySubscribedName = req.body.activitySubscribedName;
// 	const newActivitySubscribedUser = req.body.activitySubscribedUser;
// 	const newActivitySubscribed = req.body.activitySubscribed;
// 	if (!req.body.activitySubscribedName) {
// 		res.status(400);
// 		throw new Error("Please add a text field");
// 	}

// 	const activitiesSubscribed = await ActivitiesSubscribed.create({
// 		activitySubscribedName: newActivitySubscribedName,
// 		activitySubscribed: newActivitySubscribed,
// 		activitySubscribedUser: newActivitySubscribedUser,
// 	});
// 	res.status(200).json(activitiesSubscribed);
// });
// const setActivitiesSubscribed = asyncHandler(async (req, res) => {
// 	const collection = req.body;
// 	// Map the collection array to an array of Promises that save each object to the database
// 	const savePromises = collection.map((favorite) => {
// 		const newFavorite = new ActivitiesSubscribed(favorite);
// 		return newFavorite.save();
// 	});
// 	// Wait for all of the save operations to complete
// 	await Promise.all(savePromises);
// 	// Send a response to the client indicating that the collection was saved
// 	res.send("Collection received and saved to the database");
// });
const setActivitiesSubscribed = asyncHandler(async (req, res) => {
	const collection = req.body;
	// Check if there are already documents in the database with the specified activitySubscribedUser value
	const existingDocs = await ActivitiesSubscribed.find({
		activitySubscribedUser: collection[0].activitySubscribedUser,
	});
	if (existingDocs.length === 0) {
		// Map the collection array to an array of Promises that save each object to the database
		const savePromises = collection.map((favorite) => {
			const newFavorite = new ActivitiesSubscribed(favorite);
			return newFavorite.save();
		});
		// Wait for all of the save operations to complete
		await Promise.all(savePromises);
		// Send a response to the client indicating that the collection was saved
		res.send("Collection received and saved to the database");
	} else {
		// Send a response to the client indicating that the collection was not saved because the specified activitySubscribedUser value already exists
		res.send(
			"Collection not saved because the specified activitySubscribedUser value already exists"
		);
	}
});

const updateActivitiesSubscribed = asyncHandler(async (req, res) => {
	const activitiesSubscribed = await ActivitiesSubscribed.findById(
		req.params.id
	);
	if (!activitiesSubscribed) {
		res.status(400);
		throw new Error("Activity not Found");
	}
	const updateActivitiesSubscribed =
		await ActivitiesSubscribed.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
	res.status(200).json(updateActivitiesSubscribed);
});

const deleteActivitiesSubscribed = asyncHandler(async (req, res) => {
	// const id = req.params.id;
	const newActivitySubscribedUser = req.query.activitySubscribedUser;
	const newActivitySubscribedName = req.query.activitySubscribedName;

	// Use the newActivitySubscribedName and newActivitySubscribedUser values to delete the appropriate document from the collection.
	await ActivitiesSubscribed.deleteOne({
		activitySubscribedName: newActivitySubscribedName,
		activitySubscribedUser: newActivitySubscribedUser,
	}).exec();
	res.end("deleted");
});

const patchActivitiesSubscribed = asyncHandler(async (req, res) => {
	// Find the activity in the database
	const activity1 = await ActivitiesSubscribed.findById(req.params.id);
	if (!activity1) {
		res.status(400);
		throw new Error("Activity not found");
	}

	// Toggle the activity1 field
	activity1.activitySubscribed = !activity1.activitySubscribed;

	// Save the updated activity to the database
	const updatedActivity = await activity1.save();

	res.status(200).json(updatedActivity);
});

module.exports = {
	getActivitiesSubscribed,
	setActivitiesSubscribed,
	updateActivitiesSubscribed,
	deleteActivitiesSubscribed,
	patchActivitiesSubscribed,
};
