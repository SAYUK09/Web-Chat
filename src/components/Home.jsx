import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket";

export default function Home() {
  console.log(socket.connected, "op");

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  function join() {
    console.log("ent");
    if (socket === null) return null;

    socket.emit("join", 1);
  }

  return (
    <div>
      Home
      <button onClick={join}>Join</button>
    </div>
  );
}
