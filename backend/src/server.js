// Importing Express.js framework & corn npm package into Node.js application
const express = require("express");
const cors = require("cors");
const http = require("http");

const authRoutes = require("./routes/auth.routes");
const roomRoutes = require("./routes/room.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");
const adminRoutes = require("./routes/admin.routes");
const aiRoutes = require("./routes/ai.routes");

const {
  generateBoardLayout,
} = require("./utils/boardGenerator");

const {
  initializeSocket,
} = require("./socket/socket");

const questionRoutes = require("./routes/question.routes");
const gameplayRoutes = require("./routes/gameplay.routes");

// initializes a new Express application by calling the top-level express() function. 'app' object serves as core of web server
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://checkmate-quest.vercel.app"
    ],
    credentials: true,
  })
);
// The express.json() is a built-in middleware in Express. Helps an app read JSON data sent from the client (in POST/PUT requests) and makes it available in req.body
app.use(express.json());

// Standard Express.js route handler. Tells backend to listen for HTTP GET requests at the root URL (/) and respond with mentioned text
app.get("/", (req, res) => {
  res.send("Checkmate Quest Backend Running");
});

app.use("/admin", adminRoutes);
app.use("/admin/questions", questionRoutes);
app.use("/admin/ai", aiRoutes);

app.use("/rooms", roomRoutes);
app.use("/", leaderboardRoutes);

app.get("/test-board", (req, res) => {
  const board = generateBoardLayout();
  res.json(board);
});

app.use("/auth", authRoutes);
app.use("/", gameplayRoutes);

const PORT = process.env.PORT || 3000;

// Starting the Express server on the specified port. The callback function is executed once the server is up and running, logging a message to the console.
const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});