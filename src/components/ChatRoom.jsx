import { Button, Group, Box, LoadingOverlay } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { uploadMedia } from "../services/mediaService";
import { addMessage, fetchMessages } from "../services/chatService";
import { useAuth } from "../contexts/authContext";
import { socket } from "../socket/socket";

function ChatRoom({ activeRoom }) {
  const [chatRoomMessages, setChatRoomMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const openRef = useRef(null);
  const msg = useRef(null);
  const scrollRef = useRef();

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

  async function addMsgToDB(message, type) {
    try {
      if (activeRoom) {
        await addMessage(activeRoom.id, user._id, message, type);
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  async function uploadAudio(file) {
    setLoading(true);
    const mediaURL = await uploadMedia(file, "webchatAudio", "audio");
    mediaURL && sendMessage(mediaURL, "audio");
  }

  async function uploadVideo(file) {
    setLoading(true);
    const mediaURL = await uploadMedia(file, "webchatVideo", "video");
    mediaURL && sendMessage(mediaURL, "video");
  }

  return (
    <div className="h-full  flex flex-col bg-dark-secondary">
      <div className="px-4 text-white p-2 mb-2  rounded-md">
        <div className=" text-lg font-semibold ">{activeRoom?.title}</div>

        <div>{activeRoom?.about}</div>
      </div>

      <div className="flex-grow px-4 overflow-y-auto">
        <Box pos="relative">
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
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

                    <div className="pr-4">
                      <AudioPlayer
                        src={message.message}
                        autoPlayAfterSrcChange={false}
                        className="bg-slate-900"
                      />
                    </div>
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
          <div ref={scrollRef}></div>
        </Box>
      </div>
      <div className="flex items-center space-x-4 text-white p-4  bg-dark-input">
        <div>
          <Dropzone
            openRef={openRef}
            onDrop={uploadAudio}
            activateOnClick={false}
            accept={["audio/mpeg"]}
            disabled={loading}
          >
            <Group justify="center">
              <Button
                disabled={loading}
                onClick={() => openRef.current?.()}
                style={{ pointerEvents: "all" }}
              >
                Music
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
            disabled={loading}
          >
            <Group justify="center">
              <Button
                disabled={loading}
                onClick={() => openRef.current?.()}
                style={{ pointerEvents: "all" }}
              >
                Video
              </Button>
            </Group>
          </Dropzone>
        </div>
        <input
          disabled={loading}
          ref={msg}
          type="text"
          className="p-2 border border-gray-300 rounded flex-grow"
        />

        <button
          disabled={loading}
          onClick={() => {
            sendMessage(msg.current.value, "text");
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
