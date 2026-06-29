let io = null;

const initializeSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://checkmate-quest.vercel.app",
      ],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    socket.on("join-room", (roomId) => {
        const roomName = `room-${roomId}`;
        if (!socket.rooms.has(roomName)) {
            socket.join(roomName);
            console.log(`Socket ${socket.id} joined ${roomName}`);
        }
    });
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
};

module.exports = {
  initializeSocket,
  getIO,
};