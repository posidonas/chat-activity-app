const router = require("express").Router();
const {
	getActivitiesSubscribed,
	setActivitiesSubscribed,
	updateActivitiesSubscribed,
	deleteActivitiesSubscribed,
	patchActivitiesSubscribed,
} = require("../controllers/activitySubscribedController");

router
	.route("/")
	.get(getActivitiesSubscribed)
	.post(setActivitiesSubscribed)
	.delete(deleteActivitiesSubscribed);
router
	.route("/:id")
	.get(getActivitiesSubscribed)
	.put(updateActivitiesSubscribed)
	.patch(patchActivitiesSubscribed);

module.exports = router;
