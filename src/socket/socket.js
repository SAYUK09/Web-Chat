import { io } from "socket.io-client";

// const URL =
//   process.env.NODE_ENV === "production" ? undefined : "http://localhost:5000";

export const socket = io("ws://localhost:5000", {
  transports: ["websocket"],
});
