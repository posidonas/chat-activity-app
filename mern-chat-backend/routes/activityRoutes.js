const router = require("express").Router();
const {
	getActivities,
	setActivities,
	updateActivities,
	deleteActivities,
} = require("../controllers/activityController");

router
	.route("/")
	.get(getActivities)
	.post(setActivities)
	.delete(deleteActivities);
router.route("/:id").put(updateActivities);

module.exports = router;
