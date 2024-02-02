import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhBam6DufY4Qq6UG-kPo2qlRu2emznOTU",
  authDomain: "web-chat-46ca7.firebaseapp.com",
  projectId: "web-chat-46ca7",
  storageBucket: "web-chat-46ca7.appspot.com",
  messagingSenderId: "784043765446",
  appId: "1:784043765446:web:c8e2e9c36738b6de1c31c7",
  measurementId: "G-9GC2HSZX3W",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export { auth };
