import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useAuth } from "../contexts/authContext";
import { Center, Button } from "@mantine/core";

export default function loginWithGoogle() {
  const { setUser } = useAuth();

  console.log(auth);
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
    const response = await fetch(`http://localhost:5000/users`, {
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
  }

  return (
    <Center h={"100%"}>
      <Button onClick={loginWithGoogle}>Login</Button>
    </Center>
  );
}
