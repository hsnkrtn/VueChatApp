<template>
  <div>
      <img class="request-avatar" v-if="request.avatarUrl" :src="request.avatarUrl || defaultAvatar" alt="user pic">
      <span>{{request.from}}</span>
      <button @click="acceptFriendshipRequest(index)">Accept</button>
  </div>
</template>
<script>
import manDefaultAvatar from "../../assets/man.png"; 
import { EventBus } from '../../helpers/EventBus/EventBus'
export default {
  name: "friendshipRequest",
  props: {
      request:{
          type:Object
      },
      index:{
          type:[Number,String]
      }
  },
  methods:{
      acceptFriendshipRequest({index,request}){
          EventBus.$emit('acceptFriendship',index)
      }
  },
  computed:{
      defaultAvatar(){
          return manDefaultAvatar
      }
  }
};
</script>
<style scoped>
.request-avatar{
    height: 24px;
    width: 24px;
}
</style>