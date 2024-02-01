import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socket/socket";
import { useAuth } from "../contexts/authContext";
import { addMessage, fetchMessages, fetchRooms } from "../services/chatService";
import { Dropzone } from "@mantine/dropzone";
import { Button, Group } from "@mantine/core";
import { uploadMedia } from "../services/mediaService";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import ReactPlayer from "react-player";

export default function Home() {
  const { user } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [chatRoomMessages, setChatRoomMessages] = useState([]);

  const openRef = useRef(null);
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

  async function uploadAudio(file) {
    const mediaURL = await uploadMedia(file, "webchatAudio", "audio");
    mediaURL && sendMessage(mediaURL, "audio");
  }

  async function uploadVideo(file) {
    const mediaURL = await uploadMedia(file, "webchatVideo", "video");
    mediaURL && sendMessage(mediaURL, "video");
  }

  console.log(chatRoomMessages);

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
            chatRoomMessages?.map((message) => {
              if (message.type === "text") {
                return (
                  <div key={message.id} className="mb-4">
                    <div className="font-bold">{message.sender}</div>
                    <div>{message.message}</div>
                  </div>
                );
              } else if (message.type === "audio") {
                return (
                  <div key={message.id} className="mb-4">
                    <div className="font-bold">{message.sender}</div>

                    <AudioPlayer
                      src={message.message}
                      autoPlayAfterSrcChange={false}
                    />
                  </div>
                );
              } else if (message.type === "video") {
                return (
                  <div key={message.id} className="mb-4">
                    <div className="font-bold">{message.sender}</div>
                    <ReactPlayer url={message.message} controls={true} />
                  </div>
                );
              }
            })}
        </div>

        <div className="flex items-center space-x-4 bg-slate-900 p-4">
          <div>
            <Dropzone
              openRef={openRef}
              onDrop={uploadAudio}
              activateOnClick={false}
              accept={["audio/mpeg"]}
            >
              <Group justify="center">
                <Button
                  onClick={() => openRef.current?.()}
                  style={{ pointerEvents: "all" }}
                >
                  M
                </Button>
              </Group>
            </Dropzone>
          </div>

          <div>
            <Dropzone
              openRef={openRef}
              onDrop={uploadVideo}
              activateOnClick={false}
              accept={["video/mp4"]}
            >
              <Group justify="center">
                <Button
                  onClick={() => openRef.current?.()}
                  style={{ pointerEvents: "all" }}
                >
                  V
                </Button>
              </Group>
            </Dropzone>
          </div>
          <input
            ref={msg}
            type="text"
            className="p-2 border border-gray-300 rounded flex-grow"
          />

          <button
            onClick={() => {
              sendMessage(msg.current.value, "text");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
