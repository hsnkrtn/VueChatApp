<template>
  <div class="chatbox">
    <hr />
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-4">
          <slot name="users" />
        </div>
        <div class="col-md-8">
          <div :class="genderClass">
            <h2 class="chatbox__username">{{currentUser.userName}}</h2>
            <button @click="sendFriendShipRequest(currentUser)">Invite</button>
            <img class="chatbox__avatar" :src="currentUser.avatarUrl || defaultAvatar" alt="image" />
          </div>
          <chat-container
            :myUserName="myUserName"
            :currentUser="currentUser"
            :messages="messagesBetweenCurrentUser"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import manDefaultAvatar from "../../assets/man.png";
import vrouwDefaultAvatar from "../../assets/vrouw.png";
import { EventBus } from "../../helpers/EventBus/EventBus";
import ChatContainer from "./messageContainer/ChatContainer";
export default {
  components: {
    ChatContainer
  },
  props: {
    currentUser: {
      Type: Object,
      required: true
    },
    myUserName: {
      Type: String,
      required: true
    },
    messagesBetweenCurrentUser: {
      Type: Array,
      required: false,
      default: () => []
    }
  },
  computed: {
    defaultAvatar() {
      return this.currentUser.gender === "Man"
        ? manDefaultAvatar
        : vrouwDefaultAvatar;
    },
    genderClass() {
      const _className = "chatbox__personal-info";
      return {
        [_className]: true,
        [`${_className}--woman`]: this.currentUser.gender == "Woman",
        [`${_className}--man`]: this.currentUser.gender == "Man"
      };
    }
  },
  methods: {
    sendFriendShipRequest(user) {
      EventBus.$emit("addFriendshipRequest", { ...user });
    }
  }
};
</script>
<style lang="scss">
.chatbox {
  &__avatar {
    border-radius: 20%;
    width: 120px;
    height: 120px;
    margin: 5px;
    overflow: "hidden";
  }
  &__personal-info {
    border: 5px solid greenyellow;
    display: flex;
    justify-content: space-between;
    &--man {
      background-color: aqua;
    }
    &--woman {
      background-color: pink;
    }
  }
}
</style>

