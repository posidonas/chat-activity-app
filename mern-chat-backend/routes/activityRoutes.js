const router = require("express").Router();
const {
	getActivities,
	setActivities,
	updateActivities,
	deleteActivities,
} = require("../controllers/activityController");

router.route("/").get(getActivities).post(setActivities);
router.route("/:id").put(updateActivities).delete(deleteActivities);

module.exports = router;
