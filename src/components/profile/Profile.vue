<template>
  <div class="profil">
    <img class="profil__avatar" v-if="user.avatarUrl" :src="user.avatarUrl" alt="resim iste">
    <h2 class="profil__user-name">{{user.userName}}</h2>
    <h2 class="profil__friends-count">Your FriendshipRequests [{{user.friendshipRequests.length}}]</h2>
    <FriendshipRequest v-for="(request, index) in user.friendshipRequests.filter(req=>req.to===user.userName && !req.approved)" :key="index" :request="request" :index="index"/>
    <h2 class="profil__friends-count">Your Friends [{{user.friends.length}}]</h2>
    <h2 class="profil__messages-count">Your Messages [{{user.messages.length}}]</h2>
  </div>
</template>

<script>
import FriendshipRequest from '../firendshipRequest/firendshipRequest'
export default {
  components:{
    FriendshipRequest
  },
  computed:{
    user(){
      return this.$store.getters.user
    }
  }
};
</script>
<style lang="scss">
.profil {
  &__user-name {
  }
  &__friends-count {
  }
  &__messages-count {
  }
  &__avatar {
    width: 200px;
    border-radius: 20%;
  }
}
</style>

