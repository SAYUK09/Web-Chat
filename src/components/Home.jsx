import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket/socket";
import { fetchRooms } from "../services/chatService";
import ChatRoom from "./ChatRoom";

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
      <aside className="bg-dark-primary col-span-2  overflow-y-auto border-r-2">
        <div className="p-4 bg-dark-secondary">Select a room</div>
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => {
              setRoom(room.id);
            }}
          >
            <div
              className={
                "border-b mx-4 p-4 hover:bg-slate-700 cursor-pointer  " +
                (activeRoom?.id === room.id ? "bg-dark-active" : "")
              }
            >
              {room.title}
            </div>
          </div>
        ))}
      </aside>

      {activeRoom ? (
        <div className="col-span-10 overflow-y-auto">
          <ChatRoom activeRoom={activeRoom} />
        </div>
      ) : (
        <div>NOT</div>
      )}
    </div>
  );
}
