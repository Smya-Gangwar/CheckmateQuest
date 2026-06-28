const adminService = require("../services/admin.service");

const getAnalytics = async (req, res) => {
  try {
    const { roomId } = req.params;
    const analytics = await adminService.getRoomAnalytics(Number(roomId));
    res.json(analytics);
  }
  catch(error) {
    console.error(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

const getAdminRooms = async (req, res) => {
  try {
    const rooms = await adminService.getAdminRooms(
      req.admin.adminId
    );
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const result = await adminService.deleteRoom(
      Number(roomId),
      req.admin.adminId
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const closeRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const result = await adminService.closeRoom(Number(roomId), req.admin.adminId);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
  getAdminRooms,
  deleteRoom,
  closeRoom,
};