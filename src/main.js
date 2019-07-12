import Vue from 'vue'
import App from './App.vue'
import  "bootstrap/dist/css/bootstrap.min.css"
import VueResource from "vue-resource"
Vue.use(VueResource);
Vue.http.options.root="https://ilovevue-4cad7.firebaseio.com/";

new Vue({
  el: '#app',
  render: h => h(App)
})
    // IsAlreadyAUser(user) {
    //   return this.users.includes(a => a.userName == user.userName);
    // },
    // SignUp(user) {
    //   this.IsSigningUp = true;
    //   if (this.IsAlreadyAUser(user)) {
    //     this.IsAlreadyUser = true;
    //     this.IsLogedIn = false;
    //   } else {
    //     usersRef.push(user);
    //     publicMessagesRef.push(user.messages[0]);
    //   }
    // },
    // GetUsers() {
    //   usersRef.once("value", snap => {
    //     let rawUsers = snap.val();
    //     Object.keys(rawUsers).forEach(key => {
    //       this.users.push(rawUsers[key]);
    //     });
    //   });
    // },

    // let config = {
//   apiKey: "AIzaSyB8ehav1MusBGD-k_jw5jMrxz85LHu0J8c",
//   authDomain: "ilovevue-4cad7.firebaseapp.com",
//   databaseURL: "https://ilovevue-4cad7.firebaseio.com",
//   storageBucket: "ilovevue-4cad7.appspot.com"
// };

// let app = Firebase.initializeApp(config);
// let storage = app.storage();
// let db = app.database();
// let usersRef = db.ref("users");
// let publicMessagesRef = db.ref("publicMessages");
