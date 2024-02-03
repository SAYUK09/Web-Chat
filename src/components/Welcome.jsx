import React from "react";

export default function Welcome() {
  return (
    <div className="bg-dark-secondary h-full flex flex-col items-center justify-center max-h-fit">
      <img className="max-w-none my-4 h-1/4" src="/chat.svg" />
      <div className="text-4xl py-2 ">WEB CHAT</div>
      <p className="text-gray text-xl">
        From tech talks to meme laughs, find your chatroom haven
      </p>
    </div>
  );
}
