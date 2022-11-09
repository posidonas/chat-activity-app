const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomUser: {
    type: String,
  },
  room: {
    type: String,
    require: [true, 'Please add a Room']
  },
  roomType: {
    type: String,
  },
  roomDate: {
    type: String,
    require: [true, 'Please add a Date']
  }
}, {

    timestamps: true
})

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room