<template>
  <div class="chatbox">
    <div :class="genderClass">
      <h2 class="chatbox__username">{{currentUser.userName}}</h2>
      <img class="chatbox__avatar" :src="currentUser.avatarUrl || defaultAvatar" alt="image">
    </div>
    <hr>
    
    <chat-container :currentUser="currentUser" :messages="messagesBetweenCurrentUser"/>
  </div>
</template>

<script>
import manDefaultAvatar from "../../assets/man.png";
import vrouwDefaultAvatar from "../../assets/vrouw.png";
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
    messagesBetweenCurrentUser: {
      Type: Array,
      required: false,
      default:()=>([])
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
        [`${_className}--man`]: this.currentUser.gender == "Man",
      };
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

