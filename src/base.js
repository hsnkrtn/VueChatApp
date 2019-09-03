import Firebase from 'firebase';
let config = {
    apiKey: "AIzaSyB8ehav1MusBGD-k_jw5jMrxz85LHu0J8c",
    authDomain: "ilovevue-4cad7.firebaseapp.com",
    databaseURL: "https://ilovevue-4cad7.firebaseio.com",
    storageBucket: "ilovevue-4cad7.appspot.com"
  };
//  let fireBaseApp = Firebase.initializeApp(config);
  let app = Firebase.initializeApp(config);
let storage = app.storage();
let db = app.database();
let usersRef = db.ref("users");
let typingNow = db.ref("typingNow");
let onlineUsers = db.ref("onlineUsers");
export {app, storage,db, usersRef, typingNow, getMessages, onlineUsers}
export default app;