import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useAuth } from "../contexts/authContext";

export default function Home() {
  const rooms = [
    {
      id: 1,
      title: "Tech",
      about: "Share Tech Thnings",
      messages: [{ id: 1, sender: "Elon", message: "I am alien" }],
    },
    {
      id: 2,
      title: "Memes",
      about: "Only Memes & Jokes",
      messages: [{ id: 2, sender: "Gabbar", message: "hahaha" }],
    },
    {
      id: 3,
      title: "Cricket",
      about: "RCB will win IPL this year",
      messages: [
        {
          id: 2,
          sender: "Gambhir",
          message: "Dhoni ne nhi jeetaya tha world cup",
        },
      ],
    },
  ];

  const { user } = useAuth();

  const [activeRoom, setActiveRoom] = useState(null);
  const [chatRoomMessages, setChatRoomMessages] = useState([]);

  const [msg, setMsg] = useState("");

  useEffect(() => {
    socket.connect();

    socket.on("messageReceived", ({ roomId, message, sender }) => {
      console.log(message, "rec", roomId);
      setChatRoomMessages((msg) => [...msg, { roomId, message, sender }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (activeRoom) {
      setChatRoomMessages(activeRoom.messages);
    }
  }, [activeRoom]);

  function sendMessage() {
    if (socket === null) return null;

    console.log(msg, "MSG");
    socket.emit("sendMessage", {
      roomId: activeRoom.id,
      message: msg,
      sender: user.name,
    });
  }

  function setRoom(roomId) {
    setActiveRoom(rooms.filter((room) => room.id === roomId)[0]);
    // console.log(activeRoom.messages, "ROOm");
    // setChatRoomMessages(activeRoom.messages);
  }

  console.log(activeRoom, "actRoom");
  console.log(chatRoomMessages, "MESS");

  return (
    <div>
      <div>
        <div>
          {rooms.map((room) => {
            return (
              <div
                key={room.id}
                onClick={() => {
                  setRoom(room.id);
                }}
              >
                <div>{room.title}</div>
              </div>
            );
          })}
        </div>

        <div>
          <div>
            {chatRoomMessages && (
              <div>
                {chatRoomMessages?.map((message) => {
                  return <div key={message.id}>{message.message}</div>;
                })}
              </div>
            )}

            <div>
              <input
                onChange={(event) => {
                  console.log(event);
                  setMsg(event.target.value);
                }}
                type="text"
              />

              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
