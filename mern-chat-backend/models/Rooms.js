const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  room: {
    type: String,
    require: [true, 'Please add a Room']
  },
  roomType: {
    type: String,
  }
}, {

    timestamps: true
})

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room