import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket/socket";
import { useAuth } from "../contexts/authContext";
import { addMessage, fetchMessages, fetchRooms } from "../services/chatService";
import ChatRoom from "./ChatRoom";

export default function Home() {
  const { user } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [chatRoomMessages, setChatRoomMessages] = useState([]);

  const openRef = useRef(null);
  const msg = useRef(null);
  const scrollRef = useRef();

  const [loading, setLoading] = useState(false);

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
    function onMessageReceived({ roomId, message, sender, type }) {
      setChatRoomMessages((msg) => [...msg, { roomId, message, sender, type }]);
      setLoading(false);
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
      });
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

    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeRoom]);

  function sendMessage(message, type) {
    if (socket === null) return null;

    socket.emit("sendMessage", {
      roomId: activeRoom.id,
      message: message,
      sender: user.name,
      type,
    });

    addMsgToDB(message, type);
  }

  function setRoom(roomId) {
    setActiveRoom(rooms.filter((room) => room.id === roomId)[0]);

    socket.emit("join", roomId);
  }

  async function addMsgToDB(message, type) {
    try {
      if (activeRoom) {
        await addMessage(activeRoom.id, user._id, message, type);
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log(chatRoomMessages);

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
                "border-b p-4 hover:bg-slate-700 cursor-pointer  " +
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
          <ChatRoom
            activeRoom={activeRoom}
            chatRoomMessages={chatRoomMessages}
            loading={loading}
            setLoading={setLoading}
            sendMessage={sendMessage}
            scrollRef={scrollRef}
          />
        </div>
      ) : (
        <div>NOT</div>
      )}
    </div>
  );
}
