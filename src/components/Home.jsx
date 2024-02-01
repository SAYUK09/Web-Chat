import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket/socket";
import { useAuth } from "../contexts/authContext";
import { addMessage, fetchMessages, fetchRooms } from "../services/chatService";

export default function Home() {
  const { user } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [chatRoomMessages, setChatRoomMessages] = useState([]);

  const msg = useRef(null);

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
    const fetchMessagesData = async () => {
      try {
        if (activeRoom) {
          const data = await fetchMessages(activeRoom.id);
          setChatRoomMessages(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessagesData();
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
      if (activeRoom) {
        await addMessage(activeRoom.id, user._id, msg.current.value);
      }
    } catch (error) {
      console.log(error);
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
