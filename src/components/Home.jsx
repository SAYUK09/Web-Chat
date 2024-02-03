import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket/socket";
import { fetchRooms } from "../services/chatService";
import ChatRoom from "./ChatRoom";
import Welcome from "./Welcome";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoomsData();
  }, []);

  function setRoom(roomId) {
    setActiveRoom(rooms.filter((room) => room.id === roomId)[0]);

    socket.emit("join", roomId);
  }

  return (
    <div className=" h-screen overflow-hidden grid grid-cols-12 text-white">
      <aside className="bg-dark-primary col-span-2  overflow-y-auto border-r border-solid border-dark-active">
        <div className="p-2 bg-dark-secondary">
          <div className="text-xl p-1 px-2">Select A Room</div>

          <p className="px-2 text-gray">Get Chatting!</p>
        </div>

        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => {
              setRoom(room.id);
            }}
            className={
              "hover:bg-slate-700 cursor-pointer " +
              (activeRoom?.id === room.id ? "bg-dark-active" : "")
            }
          >
            <div
              className={
                "border-b border-solid border-dark-active text-lg mx-4 p-4"
              }
            >
              {room.title}
            </div>
          </div>
        ))}
      </aside>
      <div className="col-span-10 overflow-y-auto">
        {activeRoom ? <ChatRoom activeRoom={activeRoom} /> : <Welcome />}
      </div>
    </div>
  );
}
