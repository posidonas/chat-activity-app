const router = require("express").Router();
const {
	getAppRooms,
	setAppRoom,
	updateRoom,
	updateMembers,
	deleteAppRoom,
} = require("../controllers/roomController");

router.route("/").get(getAppRooms).post(setAppRoom);

router
	.route("/:id")
	.put((req, res) => {
		const { updateType } = req.body;
		if (updateType === "updateMembers") {
			updateMembers(req, res);
		} else if (updateType === "updateRoom") {
			updateRoom(req, res);
		}
	})
	.delete(deleteAppRoom);
module.exports = router;
