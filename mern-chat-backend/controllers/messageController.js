const asyncHandler = require('express-async-handler')
const Message = require('../models/Message')

const getMessageRooms = asyncHandler(async (req, res) => {
    const messagesChat = await Message.find()
    res.status(200).json(messagesChat)
})


module.exports = {
    getMessageRooms
}