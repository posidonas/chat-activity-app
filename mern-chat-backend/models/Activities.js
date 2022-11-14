const mongoose = require("mongoose");

const ActivitiesSchema = new mongoose.Schema(
	{
		activityName: {
			type: String,
		},
		activityType: {
			type: String,
		},
		activityDescription: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Activities = mongoose.model("Activities", ActivitiesSchema);

module.exports = Activities;
