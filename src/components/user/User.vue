<template>
  <li v-if="user.userName" class="user">
    <img class="user__avatar" :src="user.avatarUrl || defaultAvatar" alt="resim iste">
    <span :class="genderClass">{{user.userName}}</span>
    <span class="user__age">{{age}}</span>
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
  background-color: black;
  list-style: none;
  &__name {
    text-align: right;
    color: greenyellow;
    &--man {
      &::after {
        content: " \2642";
        font-weight: bold;
        float: right;
        color: yellow;
        padding-right: 5px;
      }
    }
    &--woman {
      &::after {
        content: " \2640";
        font-weight: bold;
        float: right;
        color: pink;
        padding-right: 5px;
      }
    }
  }
  &__age {
    color: greenyellow;
  }
  &__avatar {
    border-radius: 20%;
    width: 50px;
    height: 75px;
    float: right;
  }
  &:hover {
    cursor: pointer;
    &::after {
      content: "bakma lann";
    }
  }
}
</style>


