const router = require('express').Router();
const { getMessageRooms } = require('../controllers/messageController');

router.route('/').get(getMessageRooms);


module.exports = router
