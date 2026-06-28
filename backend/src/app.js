const express = require('express');
const cors = require('cors');

const roomRoutes = require('./routes/room.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/rooms', roomRoutes);

module.exports = app;