const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitiesSchema = new mongoose.Schema(
	{
		activityName: {
			type: String,
		},
		activityType: {
			type: String,
		},
		activityUser: {
			type: String,
		},
		activityDescription: {
			type: String,
		},
		activitySubscribed: {
			type: Boolean,
		},
	},
	{ timestamps: true }
);

const Activities = mongoose.model("Activities", ActivitiesSchema);

module.exports = Activities;
