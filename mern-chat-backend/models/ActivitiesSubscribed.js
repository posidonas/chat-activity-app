const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitiesSubscribedSchema = new mongoose.Schema(
	{
		activitySubscribedName: {
			type: String,
		},
		activitySubscribedUser: {
			type: String,
		},
		activitySubscribed: {
			type: Boolean,
		},
	},
	{ timestamps: true }
);

const ActivitiesSubscribed = mongoose.model(
	"ActivitiesSubscribed",
	ActivitiesSubscribedSchema
);

module.exports = ActivitiesSubscribed;
