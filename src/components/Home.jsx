import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket/socket";
import { useAuth } from "../contexts/authContext";

export default function Home() {
  const { user } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [chatRoomMessages, setChatRoomMessages] = useState([]);

  const msg = useRef(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:5000/rooms");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error.message);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    function onMessageReceived({ roomId, message, sender }) {
      setChatRoomMessages((msg) => [...msg, { roomId, message, sender }]);
    }

    socket.on("messageReceived", onMessageReceived);

    return () => {
      socket.off("messageReceived");
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/rooms/${activeRoom.id}/messages`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        setChatRoomMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };
    fetchMessages();
  }, [activeRoom]);

  function sendMessage() {
    if (socket === null) return null;
    socket.emit("sendMessage", {
      roomId: activeRoom.id,
      message: msg.current.value,
      sender: user.name,
    });

    addMsgToDB();
  }

  async function addMsgToDB() {
    try {
      const response = await fetch(
        `http://localhost:5000/rooms/${activeRoom.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            message: msg.current.value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  }

  function setRoom(roomId) {
    setActiveRoom(rooms.filter((room) => room.id === roomId)[0]);
    
    socket.emit("join", roomId);
  }

  return (
    <div className=" h-screen overflow-hidden grid grid-cols-12">
      <aside className="col-span-3 py-4 overflow-y-auto">
        {rooms.map((room) => (
          <div
            className={
              "p-2 hover:bg-blue-600 cursor-pointer " +
              (activeRoom?.id === room.id ? "bg-blue-600" : "")
            }
            key={room.id}
            onClick={() => {
              setRoom(room.id);
            }}
          >
            <div>{room.title}</div>
          </div>
        ))}
      </aside>

      <div className="col-span-9 p-4 overflow-y-auto flex flex-col">
        <div className="flex-grow overflow-y-auto">
          {chatRoomMessages &&
            chatRoomMessages?.map((message) => (
              <div key={message.id} className="mb-4">
                <div className="font-bold">{message.sender}</div>
                <div>{message.message}</div>
              </div>
            ))}
        </div>

        <div className="flex items-center space-x-4 py-4">
          <input
            ref={msg}
            type="text"
            className="p-2 border border-gray-300 rounded"
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-600 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
