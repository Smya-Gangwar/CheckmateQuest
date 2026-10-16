import { io } from "socket.io-client";

// Production: use the same HTTPS domain as the frontend.
// Local development: use VITE_API_URL from your local environment.
const socketUrl = import.meta.env.PROD
  ? window.location.origin
  : import.meta.env.VITE_API_URL;

const socket = io(socketUrl, {
  transports: ["websocket", "polling"],
  reconnection: true,
});

export default socket;