import { io } from "socket.io-client";

// const URL =
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000";

const backendURL = import.meta.env.VITE_BACKEND_URL;
const socketURL = backendURL.startsWith("http")
  ? `ws${backendURL.slice(4)}`
  : `ws://${backendURL}`;

export const socket = io(socketURL, {
  transports: ["websocket"],
});
