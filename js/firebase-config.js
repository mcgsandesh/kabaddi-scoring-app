// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
/**
const firebaseConfig = {
  apiKey: "AIzaSyDvSYHziHj_2jgmavr-2L2kaduJRedVjfY",
  authDomain: "kabaddi-score-pro.firebaseapp.com",
  projectId: "kabaddi-score-pro",
  storageBucket: "kabaddi-score-pro.firebasestorage.app",
  messagingSenderId: "590537516190",
  appId: "1:590537516190:web:2fe6bc4c92e5728b96078f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
*/

const firebaseConfig = {
  apiKey: "AIzaSyDvSYHziHj_2jgmavr-2L2kaduJRedVjfY",
  authDomain: "kabaddi-score-pro.firebaseapp.com",
  projectId: "kabaddi-score-pro",
  storageBucket: "kabaddi-score-pro.firebasestorage.app",
  messagingSenderId: "590537516190",
  appId: "1:590537516190:web:2fe6bc4c92e5728b96078f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();