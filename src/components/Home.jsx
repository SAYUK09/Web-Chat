import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useAuth } from "../contexts/authContext";

export default function Home() {
  const { user } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [chatRoomMessages, setChatRoomMessages] = useState([]);

  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:5000/rooms");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();
        console.log(data, "data");
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
  }, [socket]);

  useEffect(() => {
    if (activeRoom) {
      setChatRoomMessages(activeRoom.messages);
    }
  }, [activeRoom]);

  function sendMessage() {
    if (socket === null) return null;
    socket.emit("sendMessage", {
      roomId: activeRoom.id,
      message: msg,
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
            message: msg,
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
  }

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
            {chatRoomMessages &&
              chatRoomMessages?.map((message) => {
                return (
                  <div key={message.id}>
                    <div>From: {message.sender}</div>

                    <div>{message.message}</div>
                  </div>
                );
              })}

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
