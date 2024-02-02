import { io } from "socket.io-client";

// const URL =
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000";

const socketURL = backendUrl.startsWith("http")
  ? `ws${backendUrl.slice(4)}`
  : `ws://${backendUrl}`;

export const socket = io(socketURL, {
  transports: ["websocket"],
});
