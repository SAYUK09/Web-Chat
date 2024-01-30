import React from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useAuth } from "../contexts/authContext";

export default function loginWithGoogle() {
  const { user } = useAuth();
  console.log(user);

  console.log(auth);
  function loginWithGoogle() {
    const googleProvider = new GoogleAuthProvider();

    signInWithPopup(auth, googleProvider)
      .then(({ user: { displayName, email, photoURL, uid } }) => {
        console.log({ displayName, email, photoURL, uid });
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  }

  return <div onClick={loginWithGoogle}>Login</div>;
}
