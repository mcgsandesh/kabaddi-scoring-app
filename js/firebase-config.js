
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

// firebase-config.js मध्ये हे जोडा
db.enablePersistence()
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
      } else if (err.code == 'unimplemented') {
          console.warn("The current browser doesn't support all of the features needed to enable persistence");
      }
  });
