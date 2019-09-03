<template>
  <div class="container">
    <h1 v-if="IsSignedUp">Signed Up</h1>
    <div class="container">
      <div class="col-md-6">
        <profile v-if="IsLogedIn" :user="user" />
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
      </div>
    </div>
    <div class="container">
      <chat-box
        v-if="IsLogedIn"
        :currentUser="currentConversationWith"
        :messagesBetweenCurrentUser="messagesBetweenCurrentUserData"
        :myUserName="user.userName"
      >
        <template #users>
          <users
            v-if="IsLogedIn"
            :users="usersProfiles"
            :friendshipRequests="friendshipRequests"
            :usersTypingToMe="usersTypingToMe"
            :unSeenMessages="unSeenMessages"
            @currentUserChanged="setCurrentUser"
            :onlineUsers="onlineUsers"
          />
        </template>
      </chat-box>
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
import { db, usersRef, storage, typingNow, onlineUsers } from "./base";
import app from "./base";
import { pathOr, flatten } from "../node_modules/ramda";
import ChatBox from "./components/messageBox/ChatBox";
import { EventBus } from "./helpers/EventBus/EventBus";
import newMessage from "./constants/newMessage";
import newFriendShipRequest from "./constants/newFriendShipRequest";
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
      unSeenMessages: [],
      onlineUsers: []
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
    let onlineUsersLocal=[]
   const online= onlineUsers.on("value", snap => {
           onlineUsersLocal = Object.entries(snap.val()).map(e => {
        return  Object.assign(e[1], { key: e[0] });
      });
      this.onlineUsers = onlineUsersLocal;
    });
    // get new unread mmessages
  },
  mounted() {
    EventBus.$on("messageReadyToSend", messageToSend => {
      this.sendMessage(messageToSend);
    });
    EventBus.$on("addFriendshipRequest", user => {
      this.sendFriendshipRequest(user);
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
      } else {
        this.IsLogedIn = false;
      }
    },
    beginWithChat(loginData) {
      this.IsLogedIn = true;
      this.user = loginData.logednInUser;
      this.currentConversationWith = this.users.filter(
        a => a.userName == "public"
      )[0];

      // get sync unread messages
      usersRef.child(`${this.user.key}/messages`).on("value", snap => {
        this.user.messages = [...snap.val()];
        this.unSeenMessages = this.user.messages.filter(a => !a.gelesen);
      });

      // get sync friendship requests
      usersRef
        .child(`${this.user.key}/friendshipRequests`)
        .on("value", snap => {
          this.user.friendshipRequests = [...snap.val()];
        });


      onlineUsers.child(this.user.key).set(getSingleUserData(this.user));
      // usersRef.child(`${this.user.key}/messages`).on('child_added', snap => {
      //  if(!snap.val().gelesen)this.unSeenMessages.push
      //   //this.unSeenMessages = [...snap.val()].filter(a => !a.gelesen);
      // });
    },
    setCurrentUser(incomingUser) {
      this.currentConversationWith = { ...incomingUser };
      usersRef.child(`${this.user.key}/messages`).on("value", snap => {
        [...snap.val()].map((message, index) => {
          this.messagesBetweenCurrentUserData = [...snap.val()].filter(
            message =>
              this.isMessageBetweenUserAndCurrentUser(message, incomingUser)
          );
        });
      });
    },
    sendMessage(message) {
      newMessage.id = Guid.raw();
      newMessage.from = this.user.userName;
      newMessage.to = message.naar.userName;
      newMessage.text = message.bericht;
      newMessage.avatarUrl = null;
      newMessage.sendingTime = this.getSendingTime();
      if (this.currentConversationWith.userName === newMessage.to) {
        this.sendMessageToMe({ ...newMessage, gelesen: true }, this.user.key);
        this.sendMessageToHim(
          { ...newMessage, gelesen: false },
          message.naar.key
        );
      }
    },
    sendMessageToMe(message, key) {
      usersRef.child(`${key}/messages`).once("value", snap => {
        usersRef.child(`${key}/messages`).set([...snap.val(), { ...message }]);
      });
    },
    sendMessageToHim(message, key) {
      usersRef.child(`${key}/messages`).once("value", snap => {
        usersRef.child(`${key}/messages`).set([...snap.val(), message]);
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
    logOut() {},
    getSendingTime() {
      const date = new Date();
      const hour = date.getHours();
      const minute = date.getMinutes();
      return `${hour}:${minute < 10 ? "0" + minute : minute}`;
    },
    sendFriendshipRequest(toPerson) {
      newFriendShipRequest.from = this.user.userName;
      newFriendShipRequest.to = toPerson.userName;
      newFriendShipRequest.avatarUrl = toPerson.avatarUrl;
      newFriendShipRequest.approved = false;
      this.sendRequestTo(newFriendShipRequest, this.user.key);
      this.sendRequestTo(newFriendShipRequest, toPerson.key);
    },
    sendRequestTo(request, key) {
      usersRef.child(`${key}/friendshipRequests`).once("value", snap => {
        usersRef
          .child(`${key}/friendshipRequests`)
          .set([...snap.val(), request]);
      });
    }
  },
  computed: {
    usersTypingToMe() {
      return this.IsLogedIn
        ? this.peopleTyping.filter(a => a.isTypingTo === this.user.userName)
        : [];
    },
    usersProfiles() {
      return this.users.filter(a => a.userName !== this.user.userName);
    },
    friendshipRequests() {
      return this.user.friendshipRequests.filter(a => a.userName !== "public");
    }
  },
  watch: {
    currentConversationWith(newUser) {
      if (newUser) {
        usersRef.child(`${this.user.key}/messages`).on("value", snap => {
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
