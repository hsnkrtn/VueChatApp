<template>
  <div class="container">
    <h1 v-if="IsSignedUp">Signed Up</h1>
    <div class="container">
      <div class="col-md-6">
        <profile v-if="IsLogedIn" />
        <sign-up-page
          v-if="UserWantsToSignUp"
          @userWantsToLogin="
            () => {
              UserWantsToLogin = true;
              UserWantsToSignUp = false;
            }
          "
        />
        <login-page
          v-if="UserWantsToLogin && !UserWantsToSignUp && !IsLogedIn"
          @UserWantsToSignUp="() => (UserWantsToSignUp = true)"
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
        :hasFriendshipRequest="hasFriendshipRequest"
        :isRequestFromMe="isRequestFromMe"
        :friendshipRequest="friendshipRequest"
      >
        <template #users>
          <users
            v-if="IsLogedIn"
            :users="users"
            :friendshipRequests="friendshipRequests"
            :usersTypingToMe="usersTypingToMe"
            :unSeenMessages="unSeenMessages"
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
import ChatBox from "./components/messageBox/ChatBox";
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
      resource: {},
      node: "data",
      peopleTyping: [],
      unSeenMessages: [],
      onlineUsers: []
    };
  },
  created() {
    this.$store.dispatch("setUsers");
  },
  mounted() {
    this.$store.dispatch("getOnlineUsers");
  },
  methods: {
    IsAlreadyAUser(user) {
      return this.users.includes(a => a.userName == user.userName);
    },
    Login(user) {
      if (this.IsAlreadyAUser(user)) {
        this.IsLogedIn = true;
      } else {
        this.IsLogedIn = false;
      }
    },
    beginWithChat(loginData) {
      this.$store.dispatch("initUser", loginData.logednInUser);
      this.$store.dispatch("setCurrentConversationWith", this.publicUser);
      this.$store.dispatch("setMyMessages");
      this.$store.dispatch("setMyFriendshipRequests");

      this.IsLogedIn = true;
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
    hasFriendshipRequest() {
      return this.$store.getters.hasfriendShipRequest;
    },
    requestText() {
      if (this.hasFriendshipRequest) {
        if (this.friendshipRequest.approved) return "Your Friend";
        else if (this.friendshipRequest.from === this.user.userName)
          return "Pending";
        return "Accept Friendship request";
      }
      return "Invite";
    },
    isRequestFromMe() {
      return (
        this.hasFriendshipRequest &&
        this.friendshipRequest.from === this.user.userName
      );
    },
    usersTypingToMe() {
      return this.IsLogedIn
        ? this.peopleTyping.filter(a => a.isTypingTo === this.user.userName)
        : [];
    },
    friendshipRequests() {
      return this.user.friendshipRequests.filter(a => a.userName !== "public");
    },
    friendshipRequest() {
      return this.$store.getters.friendshipRequest;
    },
    users() {
      return this.$store.getters.users.filter(
        user => user.userName !== this.user.userName
      );
    },
    user() {
      return this.$store.getters.user;
    },
    publicUser() {
      return this.$store.getters.publicUser;
    },
    currentConversationWith() {
      return this.$store.getters.currentConversationWith;
    },
    messagesBetweenCurrentUserData() {
      return this.$store.getters.messagesBetweenCurrentUserData;
    }
  }
};
</script>
