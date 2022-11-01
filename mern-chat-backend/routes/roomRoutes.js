const router = require('express').Router();
const { getAppRooms, setAppRoom, updateAppRoom, deleteAppRoom } = require('../controllers/roomController');

router.route('/').get(getAppRooms).post(setAppRoom);
router.route('/:id').put(updateAppRoom).delete(deleteAppRoom);

module.exports = router
