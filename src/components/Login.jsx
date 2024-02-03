import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useAuth } from "../contexts/authContext";
import { Center, Button, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  function loginWithGoogle() {
    const googleProvider = new GoogleAuthProvider();

    signInWithPopup(auth, googleProvider)
      .then(({ user: { displayName, email, photoURL, uid } }) => {
        registerUserInDB({ name: displayName, email, photoURL, uid });
      })

      .catch((error) => {
        console.log(error);
        return;
      });
  }

  async function registerUserInDB(data) {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const { data: user } = await response.json();
    console.log(user);

    const { name, email, uid, photo, _id } = user;

    localStorage.setItem(
      "auth",
      JSON.stringify({ name, email, uid, photo, _id })
    );

    setUser({ name, email, uid, photo, _id });
    navigate("/");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full ">
      <div className="bg-dark-secondary rounded-md px-10 py-5 flex flex-col items-center justify-center">
        <div className="text-4xl text-white py-2 ">
          Find your chatroom groove
        </div>
        <p className="my-2 text-lg">
          Chat rooms for every mood, explore and connect
        </p>

        <button
          className="bg-msg-backround mt-8 px-4 py-2 text-white text-xl rounded-md"
          onClick={loginWithGoogle}
        >
          Login
        </button>

        <p className="py-2 text-white">Log in now and start chatting</p>
      </div>
    </div>
  );
}
