import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export default function Login() {
  function signin() {
    const googleProvider = new GoogleAuthProvider();
    console.log("enter");
    signInWithPopup(auth, googleProvider)
      .then(({ user: { displayName, email, photoURL, uid } }) => {
        console.log({ displayName, email, photoURL, uid });
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  }

  return <div onClick={signin}>Login</div>;
}
