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
    console.log("scolll");
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatRoomMessages]);

  useEffect(() => {
    function onMessageReceived(data) {
      setChatRoomMessages((msg) => [...msg, { ...data }]);
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
    msg.current.value = "";
    if (socket === null) return null;

    socket.emit("sendMessage", {
      roomId: activeRoom.id,
      message: message,
      sender: user.name,
      type,
    });

    addMsgToDB(message, type);
  }

  async function sendMediaMessage(file, preset, type) {
    setLoading(true);
    const mediaURL = await uploadMedia(file, preset);
    mediaURL && sendMessage(mediaURL, type);
  }

  const formatedTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);

    return formattedTime;
  };

  return (
    <div className="h-full  flex flex-col bg-dark-secondary ">
      <div className="px-4 text-white p-2 mb-2 rounded-md">
        <div className=" text-lg font-semibold ">{activeRoom?.title}</div>

        <div className="text-gray">{activeRoom?.about}</div>
      </div>

      <div className="flex-grow px-4 overflow-y-auto bg-chat-background">
        <Box pos="relative">
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          {chatRoomMessages &&
            chatRoomMessages?.map((message) => {
              const isCurrentUser = message.sender === user.name;

              if (message.type === "text") {
                return (
                  <div
                    key={message.id}
                    className={`m-4 p-4 py-2 rounded-lg text-balance flex flex-col ${
                      isCurrentUser
                        ? "w-1/5 ml-auto  bg-msg-backround "
                        : "w-1/5 mr-auto bg-incoming-msg-background"
                    }`}
                  >
                    <div className="font-bold">~ {message.sender}</div>
                    <div className="text-ellipsis hover:text-clip overflow-hidden flex-grow">
                      {message.message}
                    </div>
                    <div className="text-xs text-gray-500 self-end">
                      {formatedTimestamp(message.timestamp)}
                    </div>
                  </div>
                );
              } else if (message.type === "audio" || message.type === "video") {
                return (
                  <div
                    key={message.id}
                    className={`m-4 p-4 py-2 rounded-lg ${
                      isCurrentUser
                        ? "w-2/5 ml-auto bg-msg-backround"
                        : "w-2/5 mr-auto bg-incoming-msg-background"
                    }  text-balance flex flex-col`}
                  >
                    <div className="font-bold">~ {message.sender}</div>
                    <div className="flex-grow">
                      {message.type === "audio" ? (
                        <AudioPlayer
                          src={message.message}
                          autoPlayAfterSrcChange={false}
                          className="my-2 rounded-sm"
                        />
                      ) : (
                        <div className="my-2 rounded-sm">
                          <ReactPlayer
                            width="100%"
                            url={message.message}
                            controls={true}
                          />
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 self-end">
                      {formatedTimestamp(message.timestamp)}
                    </div>
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
            onDrop={(file) => {
              sendMediaMessage(file, "webchatAudio", "audio");
            }}
            activateOnClick={false}
            accept={["audio/mpeg"]}
            disabled={loading}
          >
            <Group justify="center">
              <Button
                disabled={loading}
                onClick={() => openRef.current?.()}
                style={{ pointerEvents: "all", background: "#075E54" }}
              >
                Music
              </Button>
            </Group>
          </Dropzone>
        </div>

        <div>
          <Dropzone
            openRef={openRef}
            onDrop={(file) => {
              sendMediaMessage(file, "webchatVideo", "video");
            }}
            activateOnClick={false}
            accept={["video/mp4"]}
            disabled={loading}
          >
            <Group justify="center">
              <Button
                disabled={loading}
                onClick={() => openRef.current?.()}
                style={{ pointerEvents: "all", background: "#075E54" }}
              >
                Video
              </Button>
            </Group>
          </Dropzone>
        </div>
        <input
          disabled={loading}
          ref={msg}
          onKeyDown={(e) => {
            console.log(e.key);
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage(msg.current.value, "text");
              msg.current.value = "";
            }
          }}
          type="text"
          className="p-2 border border-gray-300 rounded flex-grow"
        />

        <button
          disabled={loading}
          onClick={() => {
            sendMessage(msg.current.value, "text");
          }}
          className="px-4 py-2 bg-msg-backround text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
