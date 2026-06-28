const express = require("express");
const router = express.Router();

const {
  authenticateAdmin,
} = require("../middleware/auth.middleware");

const adminController = require(
  "../controllers/admin.controller"
);

router.get(
  "/rooms",
  authenticateAdmin,
  adminController.getAdminRooms
);

router.delete(
  "/rooms/:roomId",
  authenticateAdmin,
  adminController.deleteRoom
);

router.patch(
  "/rooms/:roomId/close",
  authenticateAdmin,
  adminController.closeRoom
);

module.exports = router;