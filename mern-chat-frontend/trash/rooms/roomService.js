import axios from 'axios'

const API_URL = '/rooms/'

// Create new goal
const createRoom = async (roomData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, roomData, config)

  return response.data
}

// Get user goals
const getRooms = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  return response.data
}

// Delete user goal
const deleteRoom = async (roomId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + roomId, config)

  return response.data
}

const roomService = {
  createRoom,
  getRooms,
  deleteRoom,
}

export default roomService
