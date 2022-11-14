const asyncHandler = require("express-async-handler");
const Activities = require("../models/Activities");

const getActivities = asyncHandler(async (req, res) => {
	const activities = await Activities.find();
	res.status(200).json(activities);
});

const setActivities = asyncHandler(async (req, res) => {
	const newActivityName = req.body.activityName;
	const newActivityType = req.body.activityType;
	const newActivityDescription = req.body.activityDescription;
	if (!req.body.activityName) {
		res.status(400);
		throw new Error("Please add a text field");
	}
	const activities = await Activities.create({
		activityName: newActivityName,
		activityType: newActivityType,
		activityDescription: newActivityDescription,
	});
	res.status(200).json(activities);
});

const updateActivities = asyncHandler(async (req, res) => {
	const activities = await Activities.findById(req.params.id);
	if (!activities) {
		res.status(400);
		throw new Error("Activity not Found");
	}
	const updateActivities = await Activities.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			new: true,
		}
	);
	res.status(200).json(updateActivities);
});

const deleteActivities = asyncHandler(async (req, res) => {
	const id = req.params.id;
	await Activities.findByIdAndRemove(id).exec();
	res.end("deleted");
});

module.exports = {
	getActivities,
	setActivities,
	updateActivities,
	deleteActivities,
};
