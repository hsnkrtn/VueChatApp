<template>
  <div class="container">
    <h1 v-if="IsSignedUp">Signed Up</h1>
    <div class="row">
      <div class="col-md-6">
        <profile v-if="IsLogedIn" :user="user" />
        <users
          v-if="IsLogedIn"
          :users="users"
          @currentUserChanged="setCurrentUser"
          :usersTypingToMe="usersTypingToMe"
          :unSeenMessages="unSeenMessages"
        />
      </div>
      <div class="col-md-6">
        <sign-up-page
          v-if="UserWantsToSignUp"
          @userWantsToLogin="()=>{UserWantsToLogin=true; UserWantsToSignUp=false;}"
          @ReadyToSignUp="SignUp"
        />
        <login-page
          v-if="UserWantsToLogin && !UserWantsToSignUp && !IsLogedIn "
          @UserWantsToSignUp="()=>UserWantsToSignUp=true"
          @ReadyToLogin="Login"
          @LogedInSuccessed="beginWithChat"
        />
        <button @click="logOut">Log out</button>
        <chat-box
          v-if="IsLogedIn"
          :currentUser="currentConversationWith"
          :messagesBetweenCurrentUser="messagesBetweenCurrentUserData"
        />
      </div>
    </div>
  </div>
</template>
<script>
//dependencies
import Guid from "guid";
// Pages
import SignUpPage from "./pages/SignUpPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import Profile from "./components/profile/Profile.vue";
import Users from "./components/user/Users";
import { db, usersRef, storage, typingNow } from "./base";
import app from "./base";
import { pathOr, flatten } from "../node_modules/ramda";
import ChatBox from "./components/messageBox/ChatBox";
import { EventBus } from "./helpers/EventBus/EventBus";
import newMessage from "./constants/newMessage";
function getSingleUserData(person) {
  const userName = pathOr(null, ["userName"], person);
  const gender = pathOr(null, ["gender"], person);
  const avatarUrl = pathOr(null, ["avatarUrl"], person);
  const dateOfBirth = pathOr(null, ["dateOfBirth"], person);
  const key = pathOr(null, ["key"], person);
  return {
    userName: userName,
    gender: gender,
    avatarUrl: avatarUrl,
    dateOfBirth: dateOfBirth,
    key: key
  };
}
export default {
  components: {
    SignUpPage,
    LoginPage,
    Users,
    Profile,
    ChatBox
  },
  data() {
    return {
      IsLogedIn: null,
      IsSigningUp: false,
      UserWantsToSignUp: false,
      UserWantsToLogin: true,
      IsSignedUp: false,
      IsAlreadyUser: null,
      publicMessages: [],
      users: [],
      user: {},
      resource: {},
      node: "data",
      currentConversationWith: null,
      peopleTyping: [],
      messagesBetweenCurrentUserData: [],
      unSeenMessages: []
    };
  },
  created() {
    let updatedUsers = [];
    const usersFromDB = usersRef.on("value", snap => {
      updatedUsers = Object.entries(snap.val()).map(e => {
        return Object.assign(e[1], { key: e[0] });
      });
      this.users = updatedUsers.map(person => {
        return getSingleUserData(person);
      });
    });
    // get people who are typing now
    let typppnow = [];
    const typpp = typingNow.on("value", snap => {
      typppnow = Object.entries(snap.val()).map(e => {
        return Object.assign(e[1]);
      });
      this.peopleTyping = typppnow;
    });
    // get new unread mmessages
  },
  mounted() {
    EventBus.$on("messageReadyToSend", messageToSend => {
      this.sendMessage(messageToSend);
    });
    EventBus.$on("isTypingNow", id => {
      typingNow.child(id).set({
        isTyping: this.user.userName,
        isTypingTo: this.currentConversationWith.userName
      });
    });
    EventBus.$on("typingDone", id => {
      typingNow.child(id).remove();
    });
    // if (this.user) {
    //   this.unSeenMessages=this.user.messages.filter(a=>!a.gelesen)
    //   // usersRef.child(`${this.user.key}/messages`).on("value", snap => {
    //   //   this.unSeenMessages = [...snap.val()]
    //   // });
    // }
  },
  methods: {
    IsAlreadyAUser(user) {
      return this.users.includes(a => a.userName == user.userName);
    },
    SignUp(user) {
      this.IsSigningUp = true;
      if (this.IsAlreadyAUser(user)) {
        this.IsAlreadyUser = true;
        this.IsLogedIn = false;
      } else {
        usersRef.push(user);
        publicMessagesRef.push(user.messages[0]);
      }
    },
    GetUsers() {
      usersRef.once("value", snap => {
        let rawUsers = snap.val();
        Object.keys(rawUsers).forEach(key => {
          this.users.push(rawUsers[key]);
        });
      });
    },
    Login(user) {
      this.GetUsers();
      if (this.IsAlreadyAUser(user)) {
        this.IsLogedIn = true;
        console.log("noluyo lann", user);
      } else {
        this.IsLogedIn = false;
      }
    },
    beginWithChat(loginData) {
      this.IsLogedIn = true;
      this.user = loginData.logednInUser;
      this.unSeenMessages = this.user.messages.filter(a => !a.gelesen);
      this.currentConversationWith = this.users.filter(
        a => a.userName == "public"
      )[0];

      // get sync unread
      usersRef.child(`${this.user.key}/messages`).on("value", snap => {
        this.unSeenMessages = [...snap.val()].filter(
          a => !a.gelesen && a.from !== this.currentConversationWith.userName
        );
      });
    },
    setCurrentUser(incomingUser) {
      this.currentConversationWith = { ...incomingUser };
    },
    sendMessage(message) {
      let mess = newMessage;
      mess.id = Guid.raw();
      mess.from = this.user.userName;
      mess.to = this.currentConversationWith.userName;
      mess.text = message;
      mess.avatarUrl = null;
      this.sendMessageToMe({ ...mess, gelesen: true });
      this.sendMessageToHim({ ...mess });
    },
    sendMessageToMe(message) {
      usersRef.child(`${this.user.key}/messages`).once("value", snap => {
        usersRef
          .child(`${this.user.key}/messages`)
          .set([...snap.val(), { ...message, gelesen: true }]);
      });
    },
    sendMessageToHim(message) {
      usersRef
        .child(`${this.currentConversationWith.key}/messages`)
        .once("value", snap => {
          usersRef
            .child(`${this.currentConversationWith.key}/messages`)
            .set([...snap.val(), message]);
        });
    },
    isMessageBetweenUserAndCurrentUser(message, newUser) {
      return (
        (message.to === this.user.userName &&
          message.from === newUser.userName) ||
        (message.to === newUser.userName && message.from === this.user.userName)
      );
    },
    isMessagetoThisUser(message, newUser) {
      return (
        message.to === this.user.userName && message.from === newUser.userName
      );
    },
    logOut() {}
  },
  computed: {
    // messsagesWithCurrentUser() {
    //   let messso = [];
    //   usersRef
    //     .child(`${this.currentConversationWith.key}/messages`)
    //     .once("value", snap => {
    //       messo = [...snap.val()].filter(
    //         a =>
    //           (a.to === this.user.userName &&
    //             a.from === this.currentConversationWith.userName) ||
    //           (a.to === this.currentConversationWith.userName &&
    //             a.from === this.user.userName)
    //       );
    //     });
    //   return messso;
    // },
    usersTypingToMe() {
      return this.IsLogedIn
        ? this.peopleTyping.filter(a => a.isTypingTo === this.user.userName)
        : [];
    }
    // messagesBetweenCurrentUserData() {
    //  return this.user.messages.filter(
    //     a =>
    //       (a.to === this.user.userName &&
    //         a.from === this.currentConversationWith.userName) ||
    //       (a.to === this.currentConversationWith.userName &&
    //         a.from === this.user.userName)
    //   );
    // }
  },
  watch: {
    currentConversationWith(newUser) {
      if (newUser) {
        usersRef.child(`${this.user.key}/messages`).on("value", snap => {
          this.messagesBetweenCurrentUserData = [...snap.val()].filter(
            message => this.isMessageBetweenUserAndCurrentUser(message, newUser)
          );
          [...snap.val()].map((message, index) => {
            if (
              this.isMessagetoThisUser(message, newUser) &&
              !message.gelesen
            ) {
              usersRef
                .child(`${this.user.key}/messages`)
                .child(index)
                .set({ ...message, gelesen: true });
            }
          });
        });
      }
    }
  }
};
</script>
