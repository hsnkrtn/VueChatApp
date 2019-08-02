<template>
  <ul class="users">
    <user
      @click.native="setCurrentConversationWith(user)"
      v-for="(user,index) in users"
      :key="index"
      :user="user"
      :isTypingToMe="isTypingToMe(user)"
    />
  </ul>
</template>

<script>
import User from "./User";
export default {
  name: "Users",
  components: {
    User
  },
  props: {
    users: {
      type: Array,
      required: false,
      default: () => []
    },
    usersTypingToMe: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  methods: {
    setCurrentConversationWith(user) {
      this.$emit("currentUserChanged", user);
    },
    isTypingToMe(user){
      return this.usersTypingToMe.filter(a=>a.isTyping===user.userName).length
    }
  }
};
</script>
<style lang="scss">
.users {
  display: grid;
  .user {
    // grid-template-columns: 40px 50px auto 50px 40px;
    // grid-template-rows: 25% 100px auto;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
  }
}
</style>
