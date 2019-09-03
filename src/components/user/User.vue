<template>
  <li v-if="user.userName" class="user">
    <img class="user__avatar" :src="user.avatarUrl || defaultAvatar" alt="resim iste" />
<span v-if="isLogedIn" class="glyphicon glyphicon-ok-circle" style="color:brown"></span>
<span v-else class="glyphicon glyphicon-ok-circle" style="color:white"></span>
    <span :class="genderClass">{{user.userName}}</span>
    <span>{{unSeenMessagesCount}}</span>
    <span class="user__age">{{age}}</span>
    <span v-if="hasSentAFriendshipRequestToMe"> <i class='fas fa-user-check' style='font-size:20px;color:red'></i></span>
   
    <span v-if="isTypingToMe">... Typing</span>
  </li>
</template>

<script>
import manDefaultAvatar from "../../assets/man.png";
import vrouwDefaultAvatar from "../../assets/vrouw.png";
export default {
  name: "User",
  props: {
    user: {
      type: Object,
      required: false,
      default: () => ({})
    },
    isTypingToMe: {
      type: Boolean
    },
    numberOfUnSeenMessages: {
      type: Number
    },
    hasSentAFriendshipRequestToMe: {
      type: Boolean
    },
    isLogedIn: {
      type: Boolean
    }
  },
  computed: {
    genderClass() {
      const _className = "user__name";
      return {
        [_className]: true,
        [`${_className}--woman`]: this.user.gender == "Woman",
        [`${_className}--man`]: this.user.gender == "Man"
      };
    },
    defaultAvatar() {
      return this.user.gender == "Man" ? manDefaultAvatar : vrouwDefaultAvatar;
    },
    age() {
      const birthYear = new Date(this.user.dateOfBirth).getFullYear();
      const currentYear = new Date().getFullYear();

      return currentYear - birthYear;
    },
    unSeenMessagesCount() {
      if (this.numberOfUnSeenMessages > 0) return this.numberOfUnSeenMessages;
    }
  }
};
</script>
<style lang="scss">
.user {
  margin: 5px;
  font-size: 18px;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  background-color: #c5df42;
  list-style: none;
  &__name {
    text-align: right;
    color: black;
    &--man {
      &::after {
        content: " \2642";
        font-weight: bold;
        float: right;
        color: black;
        padding-right: 5px;
      }
    }
    &--woman {
      &::after {
        font-weight: bold;
        float: right;
        color: black;
        padding-right: 5px;
        content: " \2640";
      }
    }
  }
  &__age {
    color: black;
  }
  &__avatar {
    border-radius: 20%;
    width: 50px;
    height: 75px;
    float: right;
  }
  &:hover {
    cursor: pointer;
    background-color: #dbf84a;
  }
}
</style>


