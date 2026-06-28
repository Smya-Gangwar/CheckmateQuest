const roomService = require("../services/room.service");
const sessionService = require("../services/session.service");

// Defining asynchronous Express route handler ()
const createRoom = async (req, res) => {
  try {
    // Sends request data to service layer & req.body contains JSON data from client
    // await pauses execution until database/service work finishes
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await roomService.getRooms();
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch rooms",
    });
  }
};

const joinRoom = async (req, res) => {
  try {
    const team = await roomService.joinRoom(req.body);
    res.status(201).json(team);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await roomService.getRoomById(Number(roomId));
    res.json(room);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const getRoomTeams = async (req, res) => {
  try {
    const { roomId } = req.params;
    const data = await roomService.getRoomTeams(Number(roomId));
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

const startMatch = async (req, res) => {
  try {
    const { roomId } = req.params;
    const result =
      await roomService.startMatch(
        Number(roomId)
      );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

const getSessionsForRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const sessions = await sessionService.getSessionsForRoom(Number(roomId));
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

// Exporting the room controller functions
module.exports = {
  createRoom,
  getRooms,
  joinRoom,
  getRoomTeams,
  startMatch,
  getRoomById,
  getSessionsForRoom
};